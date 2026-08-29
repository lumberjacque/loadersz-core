import { createReadStream } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, relative, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};
const baselineBundle = resolve(valueAfter('--baseline', '.benchmark/baseline/frames.js'));
const candidateBundle = resolve(valueAfter('--candidate', '.benchmark/current/frames.js'));
const output = valueAfter('--output');
const sampleMilliseconds = Number(valueAfter('--sample-ms', '100'));
const sampleCount = Number(valueAfter('--samples', '15'));
const reportPath = (path) => relative(process.cwd(), path).replaceAll('\\', '/') || '.';
const files = new Map([
  ['/baseline.js', baselineBundle],
  ['/candidate.js', candidateBundle],
]);
const server = createServer((request, response) => {
  if (request.url === '/') {
    response.setHeader('content-type', 'text/html');
    response.end('<!doctype html><title>Loadersz A/B benchmark</title>');
    return;
  }
  const file = files.get(request.url ?? '');
  if (!file) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('content-type', 'text/javascript');
  createReadStream(file).pipe(response);
});
await new Promise((ready) => server.listen(4175, '127.0.0.1', ready));

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const launchOptions = {};
try {
  await access(edge);
  launchOptions.executablePath = edge;
} catch {}

let browser;
try {
  browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:4175/');
  const result = await page.evaluate(
    async ({ sampleMilliseconds, sampleCount }) => {
      const baseline = await import('/baseline.js');
      const candidate = await import('/candidate.js');
      const groups = {
        'projector-1': { modes: ['satellites', 'pulse', 'halo'], count: 1 },
        'projector-10': { modes: ['satellites', 'pulse', 'halo'], count: 10 },
        'projector-25': { modes: ['satellites', 'pulse', 'halo'], count: 25 },
        'mixed-10': { modes: ['orbit', 'comet', 'network', 'process', 'pulse'], count: 10 },
        'mixed-25': { modes: ['orbit', 'comet', 'network', 'process', 'pulse'], count: 25 },
        'control-10': { modes: ['spinner', 'bars', 'equalizer', 'marquee'], count: 10 },
        'control-25': { modes: ['spinner', 'bars', 'equalizer', 'marquee'], count: 25 },
      };
      const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
      const percentile = (values, fraction) => {
        const sorted = [...values].sort((a, b) => a - b);
        return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
      };
      let checksum = 0;
      const measureGroup = (configuration) => {
        const contexts = Array.from({ length: configuration.count }, () => {
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;
          return canvas.getContext('2d');
        });
        const run = (implementation, rounds, phase) => {
          const start = performance.now();
          for (let round = 0; round < rounds; round += 1) {
            for (let index = 0; index < configuration.count; index += 1) {
              const frame = implementation.FRAME_BUILDERS[configuration.modes[index % configuration.modes.length]]({
                time: phase + (round % 97) / 60,
                radius: 26.24,
                density: configuration.count === 1 ? 1 : 2,
                particleRadius: 1,
              });
              implementation.paintFrame(contexts[index], frame, 'dark');
              checksum += frame.dots.length + frame.lines.length * 3 + frame.rects.length * 5 + frame.arcs.length * 7;
            }
          }
          return performance.now() - start;
        };
        run(baseline, 20, 0.6);
        run(candidate, 20, 0.6);
        let rounds = 2;
        while (Math.min(run(baseline, rounds, 1.25), run(candidate, rounds, 1.25)) < sampleMilliseconds / 2) {
          rounds *= 2;
        }
        const baselineTimings = [];
        const candidateTimings = [];
        const sample = (implementation, timings, phase) => {
          timings.push((run(implementation, rounds, phase) * 1e6) / (rounds * configuration.count));
        };
        for (let index = 0; index < sampleCount; index += 1) {
          if (index % 2 === 0) {
            sample(baseline, baselineTimings, index * 0.17);
            sample(candidate, candidateTimings, index * 0.17);
          } else {
            sample(candidate, candidateTimings, index * 0.17);
            sample(baseline, baselineTimings, index * 0.17);
          }
        }
        const summarize = (timings) => ({
          medianNanosecondsPerLoaderFrame: median(timings),
          p95NanosecondsPerLoaderFrame: percentile(timings, 0.95),
        });
        const baselineSummary = summarize(baselineTimings);
        const candidateSummary = summarize(candidateTimings);
        return {
          count: configuration.count,
          roundsPerSample: rounds,
          baseline: baselineSummary,
          candidate: candidateSummary,
          medianDeltaPercent:
            (candidateSummary.medianNanosecondsPerLoaderFrame / baselineSummary.medianNanosecondsPerLoaderFrame - 1) *
            100,
        };
      };
      return {
        userAgent: navigator.userAgent,
        sampleMilliseconds,
        sampleCount,
        groups: Object.fromEntries(Object.entries(groups).map(([name, group]) => [name, measureGroup(group)])),
        checksum,
      };
    },
    { sampleMilliseconds, sampleCount },
  );
  const report = {
    generatedAt: new Date().toISOString(),
    baselineBundle: reportPath(baselineBundle),
    candidateBundle: reportPath(candidateBundle),
    ...result,
  };
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (output) {
    const outputPath = resolve(output);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, serialized);
    console.log(`Browser A/B benchmark: ${outputPath}`);
  }
  console.log(serialized);
} finally {
  await browser?.close();
  await new Promise((closed) => server.close(closed));
}
