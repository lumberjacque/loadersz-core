import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const valueAfter = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || !process.argv[index + 1]) throw new Error(`Missing ${flag}`);
  return resolve(process.argv[index + 1]);
};
const baseline = await import(pathToFileURL(valueAfter('--baseline')).href);
const candidate = await import(`${pathToFileURL(valueAfter('--candidate')).href}?candidate=${Date.now()}`);

const compare = (left, right, path = 'root') => {
  if (Object.is(left, right)) return;
  if (typeof left !== typeof right || left === null || right === null) {
    throw new Error(`${path}: ${String(left)} !== ${String(right)}`);
  }
  if (typeof left !== 'object') throw new Error(`${path}: ${String(left)} !== ${String(right)}`);
  const leftKeys = Reflect.ownKeys(left);
  const rightKeys = Reflect.ownKeys(right);
  if (leftKeys.length !== rightKeys.length || leftKeys.some((key, index) => key !== rightKeys[index])) {
    throw new Error(`${path}: keys differ (${leftKeys.join(',')} !== ${rightKeys.join(',')})`);
  }
  leftKeys.forEach((key) => compare(left[key], right[key], `${path}.${String(key)}`));
};

const times = [0, 1 / 60, 0.1, 0.6, 1.25, 10, 123.456];
const densities = [0.35, 0.999, 1, 1.001, 2];
const radii = [6.56, 39.36, 114.8];
const particleRadii = [0.5, 1, 2.5];
let frameComparisons = 0;
for (const mode of Object.keys(baseline.FRAME_BUILDERS)) {
  if (!(mode in candidate.FRAME_BUILDERS)) throw new Error(`Candidate is missing mode ${mode}`);
  for (const time of times)
    for (const density of densities)
      for (const radius of radii)
        for (const particleRadius of particleRadii) {
          const context = { time, density, radius, particleRadius };
          compare(
            baseline.FRAME_BUILDERS[mode](context),
            candidate.FRAME_BUILDERS[mode](context),
            `${mode}@${JSON.stringify(context)}`,
          );
          frameComparisons += 1;
        }
}

const traceContext = () => {
  const trace = [];
  return {
    trace,
    context: new Proxy(
      {},
      {
        get:
          (_target, property) =>
          (...args) =>
            trace.push(['call', property, ...args]),
        set: (_target, property, value) => {
          trace.push(['set', property, value]);
          return true;
        },
      },
    ),
  };
};
let paintComparisons = 0;
for (const mode of ['pulse', 'network', 'barchart', 'gauge']) {
  for (const theme of ['dark', 'light']) {
    const context = { time: 1.25, density: 2, radius: 39.36, particleRadius: 1 };
    const left = traceContext();
    const right = traceContext();
    baseline.paintFrame(left.context, baseline.FRAME_BUILDERS[mode](context), theme);
    candidate.paintFrame(right.context, candidate.FRAME_BUILDERS[mode](context), theme);
    compare(left.trace, right.trace, `paint.${mode}.${theme}`);
    paintComparisons += 1;
  }
}
console.log(`Equivalent: ${frameComparisons} frames and ${paintComparisons} renderer scenarios.`);
