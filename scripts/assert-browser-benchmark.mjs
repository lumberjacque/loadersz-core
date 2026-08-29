import { appendFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};

const input = valueAfter('--input');
if (!input) throw new Error('Missing --input.');

const maximumMedianRegression = Number(valueAfter('--max-median-regression', '20'));
const expectedGroups = [
  'projector-1',
  'projector-10',
  'projector-25',
  'mixed-10',
  'mixed-25',
  'control-10',
  'control-25',
];
const report = JSON.parse(await readFile(resolve(input), 'utf8'));
const errors = [];

if (!Number.isInteger(report.sampleCount) || report.sampleCount < 15) {
  errors.push(`sampleCount must be at least 15, received ${String(report.sampleCount)}`);
}
if (!Number.isFinite(report.checksum) || report.checksum <= 0) {
  errors.push(`checksum must be a positive finite number, received ${String(report.checksum)}`);
}

for (const name of expectedGroups) {
  const group = report.groups?.[name];
  if (!group) {
    errors.push(`missing group ${name}`);
    continue;
  }
  for (const [label, value] of [
    ['baseline median', group.baseline?.medianNanosecondsPerLoaderFrame],
    ['candidate median', group.candidate?.medianNanosecondsPerLoaderFrame],
    ['median delta', group.medianDeltaPercent],
  ]) {
    if (!Number.isFinite(value)) errors.push(`${name}: ${label} must be finite`);
  }
  if (group.baseline?.medianNanosecondsPerLoaderFrame <= 0) errors.push(`${name}: baseline median must be positive`);
  if (group.candidate?.medianNanosecondsPerLoaderFrame <= 0) errors.push(`${name}: candidate median must be positive`);
  if (group.medianDeltaPercent > maximumMedianRegression) {
    errors.push(
      `${name}: median regressed by ${group.medianDeltaPercent.toFixed(2)}% (maximum ${maximumMedianRegression}%)`,
    );
  }
}

const formatTime = (value) => (Number.isFinite(value) ? (value / 1000).toFixed(1) : 'invalid');
const describeDelta = (value) => {
  if (!Number.isFinite(value)) return 'invalid';
  if (Math.abs(value) < 0.05) return 'unchanged';
  return `${Math.abs(value).toFixed(1)}% ${value < 0 ? 'faster' : 'slower'}`;
};
const measuredGroups = expectedGroups
  .map((name) => [name, report.groups?.[name]])
  .filter((entry) => entry[1] && Number.isFinite(entry[1].medianDeltaPercent));
const improvements = measuredGroups.map(([, group]) => -group.medianDeltaPercent);
const headline =
  improvements.length === expectedGroups.length && improvements.every((value) => value > 0)
    ? `All ${improvements.length} workloads improved: median CPU time fell by ${Math.min(...improvements).toFixed(1)}–${Math.max(...improvements).toFixed(1)}%.`
    : `${measuredGroups.filter(([, group]) => group.medianDeltaPercent <= 0).length} of ${measuredGroups.length} workloads improved or stayed unchanged.`;
const summary = [
  '## Browser benchmark',
  '',
  headline,
  '',
  '> Median time is CPU work per loader frame. Lower is better. “32% faster” means the candidate used 32% less median time than the baseline for the same work.',
  '',
  '| Workload | Baseline median | Candidate median | Raw delta | Meaning |',
  '| --- | ---: | ---: | ---: | --- |',
  ...measuredGroups.map(
    ([name, group]) =>
      `| ${name} | ${formatTime(group.baseline?.medianNanosecondsPerLoaderFrame)} µs/frame | ${formatTime(group.candidate?.medianNanosecondsPerLoaderFrame)} µs/frame | ${group.medianDeltaPercent.toFixed(1)}% | ${describeDelta(group.medianDeltaPercent)} |`,
  ),
  '',
  errors.length === 0
    ? `✅ Passed: no median regression exceeded the ${maximumMedianRegression}% CI guardrail.`
    : `❌ Rejected by the ${maximumMedianRegression}% median-regression guardrail.`,
  '',
];
if (errors.length > 0) summary.push(...errors.map((error) => `- ${error}`), '');
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary.join('\n')}\n`);
console.log(headline);

if (errors.length > 0) throw new Error(`Browser benchmark rejected:\n- ${errors.join('\n- ')}`);
console.log(
  `Browser benchmark accepted: ${expectedGroups.length} groups, no median regression above ${maximumMedianRegression}%.`,
);
