import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const percentile = (values, fraction) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
};
const coefficientOfVariation = (values) => {
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
};
const summarize = (timings, operations) => ({
  operationsPerSample: operations,
  medianNanosecondsPerFrame: median(timings),
  p95NanosecondsPerFrame: percentile(timings, 0.95),
  coefficientOfVariation: coefficientOfVariation(timings),
  framesPerSecond: 1e9 / median(timings),
});

const bundle = resolve(valueAfter('--bundle', '.benchmark/current/frames.js'));
const baselineBundleArgument = valueAfter('--baseline');
const baselineBundle = baselineBundleArgument ? resolve(baselineBundleArgument) : undefined;
const output = valueAfter('--output');
const sampleMilliseconds = Number(valueAfter('--sample-ms', '120'));
const sampleCount = Number(valueAfter('--samples', '15'));
const reportPath = (path) => relative(process.cwd(), path).replaceAll('\\', '/') || '.';
const candidate = await import(`${pathToFileURL(bundle).href}?candidate=${Date.now()}`);
const baseline = baselineBundle
  ? await import(`${pathToFileURL(baselineBundle).href}?baseline=${Date.now()}`)
  : undefined;
const allModes = Object.keys(candidate.FRAME_BUILDERS);
const groups = {
  'all-density-1': allModes,
  'all-density-2': allModes,
  'projector-density-1': ['satellites', 'pulse', 'halo'],
  'projector-density-2': ['satellites', 'pulse', 'halo'],
  'fibonacci-density-2': ['scan', 'wave', 'crystal', 'cognition', 'explore'],
  'control-density-2': ['spinner', 'bars', 'equalizer', 'marquee'],
  'paint-projector-density-2': ['satellites', 'pulse', 'halo'],
  'paint-control-density-2': ['spinner', 'bars', 'equalizer', 'marquee'],
};
let checksum = 0;
const frameSink = [];
const paintingContext = {
  save() {},
  restore() {},
  fillRect() {},
  beginPath() {},
  moveTo() {},
  lineTo() {},
  quadraticCurveTo() {},
  fill() {},
  arc() {},
  stroke() {},
};

const runOperations = (implementation, modes, density, operations, phase, paint) => {
  const start = performance.now();
  for (let index = 0; index < operations; index += 1) {
    const mode = modes[index % modes.length];
    const frame = implementation.FRAME_BUILDERS[mode]({
      time: phase + (index % 97) / 60,
      radius: 39.36,
      density,
      particleRadius: 1,
    });
    if (paint) implementation.paintFrame(paintingContext, frame, 'dark');
    frameSink[index & 63] = frame;
    checksum += frame.dots.length + frame.lines.length * 3 + frame.rects.length * 5 + frame.arcs.length * 7;
    if (frame.dots[0]) checksum += frame.dots[0].x * 1e-12;
  }
  return performance.now() - start;
};

const measureGroup = (name, modes) => {
  console.error(`Measuring ${name}...`);
  const density = name.endsWith('density-1') ? 1 : 2;
  const paint = name.startsWith('paint-');
  runOperations(candidate, modes, density, 500, 0.6, paint);
  if (baseline) runOperations(baseline, modes, density, 500, 0.6, paint);
  const calibrate = (implementation) => {
    let operations = 100;
    while (operations <= 12_800) {
      if (runOperations(implementation, modes, density, operations, 1.25, paint) >= sampleMilliseconds / 2) break;
      operations *= 2;
    }
    return operations;
  };
  const candidateOperations = calibrate(candidate);
  const baselineOperations = baseline ? calibrate(baseline) : candidateOperations;
  const candidateTimings = [];
  const baselineTimings = [];
  const sample = (implementation, operations, target, phase) => {
    target.push((runOperations(implementation, modes, density, operations, phase, paint) * 1e6) / operations);
  };
  for (let index = 0; index < sampleCount; index += 1) {
    if (baseline && index % 2 === 0) {
      sample(baseline, baselineOperations, baselineTimings, index * 0.17);
      sample(candidate, candidateOperations, candidateTimings, index * 0.17);
    } else {
      sample(candidate, candidateOperations, candidateTimings, index * 0.17);
      if (baseline) sample(baseline, baselineOperations, baselineTimings, index * 0.17);
    }
  }
  const candidateSummary = summarize(candidateTimings, candidateOperations);
  if (!baseline) return { modes: modes.length, candidate: candidateSummary };
  const baselineSummary = summarize(baselineTimings, baselineOperations);
  return {
    modes: modes.length,
    baseline: baselineSummary,
    candidate: candidateSummary,
    medianDeltaPercent:
      (candidateSummary.medianNanosecondsPerFrame / baselineSummary.medianNanosecondsPerFrame - 1) * 100,
  };
};

const result = {
  generatedAt: new Date().toISOString(),
  runtime: process.version,
  platform: `${process.platform}-${process.arch}`,
  baselineBundle: baselineBundle ? reportPath(baselineBundle) : undefined,
  candidateBundle: reportPath(bundle),
  sampleMilliseconds,
  sampleCount,
  groups: Object.fromEntries(Object.entries(groups).map(([name, modes]) => [name, measureGroup(name, modes)])),
  checksum,
};
const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (output) {
  const outputPath = resolve(output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized);
  console.log(`CPU benchmark: ${outputPath}`);
}
console.log(serialized);
