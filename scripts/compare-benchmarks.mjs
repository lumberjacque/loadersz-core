import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const valueAfter = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || !process.argv[index + 1]) throw new Error(`Missing ${flag}`);
  return process.argv[index + 1];
};
const readJson = async (path) => JSON.parse(await readFile(resolve(path), 'utf8'));
const baseline = await readJson(valueAfter('--baseline'));
const candidate = await readJson(valueAfter('--candidate'));
const percent = (before, after) => ((after / before - 1) * 100).toFixed(2);

if (baseline.groups && candidate.groups) {
  console.log('CPU (negative is faster)');
  for (const [name, before] of Object.entries(baseline.groups)) {
    const after = candidate.groups[name];
    if (!after) continue;
    console.log(
      `${name.padEnd(24)} ${percent(before.medianNanosecondsPerFrame, after.medianNanosecondsPerFrame)}% median`,
    );
  }
} else if (baseline.entries && candidate.entries) {
  console.log('Bundles (candidate - baseline)');
  for (const [name, before] of Object.entries(baseline.entries)) {
    const after = candidate.entries[name];
    if (!after) continue;
    console.log(
      `${name.padEnd(28)} raw ${after.raw - before.raw}, gzip ${after.gzip - before.gzip}, brotli ${after.brotli - before.brotli}`,
    );
  }
} else {
  throw new Error('Benchmark files are not the same kind.');
}
