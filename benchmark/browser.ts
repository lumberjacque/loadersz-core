import { registerLoadersz } from '../src/loadersz';

registerLoadersz();

declare global {
  interface Window {
    __benchmarkReady?: boolean;
    __benchmarkResult?: BrowserBenchmarkResult;
  }
}

interface BrowserBenchmarkResult {
  count: number;
  density: number;
  size: number;
  scenario: string;
  refreshPeriod: number;
  effectiveFps: number;
  intervalP50: number;
  intervalP95: number;
  intervalP99: number;
  intervalMax: number;
  overOneAndHalfBudget: number;
  overTwoAndHalfBudget: number;
  longTasks: number;
  userAgent: string;
}

const parameters = new URLSearchParams(location.search);
const form = document.querySelector<HTMLFormElement>('#benchmark-form');
const status = document.querySelector<HTMLElement>('#status');
const output = document.querySelector<HTMLElement>('#result');
const container = document.querySelector<HTMLElement>('#loaders');
if (!form || !status || !output || !container) throw new Error('Benchmark interface is incomplete.');

for (const name of ['scenario', 'count', 'density', 'size', 'warmup', 'duration']) {
  const value = parameters.get(name);
  const control = form.elements.namedItem(name);
  if (value !== null && control instanceof HTMLInputElement) control.value = value;
  if (value !== null && control instanceof HTMLSelectElement) control.value = value;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const next = new URLSearchParams();
  for (const [name, value] of new FormData(form)) next.set(name, String(value));
  next.set('run', '1');
  location.search = next.toString();
});

const count = Number(parameters.get('count') ?? 10);
const density = Number(parameters.get('density') ?? 2);
const size = Number(parameters.get('size') ?? 64);
const scenario = parameters.get('scenario') ?? 'projector';
const warmupMilliseconds = Number(parameters.get('warmup') ?? 2000);
const sampleMilliseconds = Number(parameters.get('duration') ?? 5000);
const projectorStates = ['breathing', 'observing', 'orbiting'];
const mixedStates = ['working', 'racing', 'connecting', 'processing', 'charting', 'breathing'];
const controlStates = ['loading', 'loading-bars', 'equalizing', 'marqueeing'];
const states = scenario === 'mixed' ? mixedStates : scenario === 'control' ? controlStates : projectorStates;
const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const percentile = (values: number[], fraction: number) => {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)] ?? 0;
};

async function measureRefreshPeriod(): Promise<number> {
  status.textContent = 'Measuring the display refresh period…';
  const timestamps: number[] = [];
  await new Promise<void>((resolve) => {
    const observe = (timestamp: number) => {
      timestamps.push(timestamp);
      if (timestamps.length < 90) requestAnimationFrame(observe);
      else resolve();
    };
    requestAnimationFrame(observe);
  });
  return percentile(
    timestamps.slice(1).map((timestamp, index) => timestamp - timestamps[index]),
    0.5,
  );
}

async function run(): Promise<void> {
  const button = form.querySelector<HTMLButtonElement>('button');
  if (button) button.disabled = true;
  await customElements.whenDefined('loadersz-loader');
  const refreshPeriod = await measureRefreshPeriod();
  const loaders: HTMLElement[] = [];
  container.replaceChildren();
  for (let index = 0; index < count; index += 1) {
    const loader = document.createElement('loadersz-loader');
    loader.setAttribute('state', states[index % states.length]);
    loader.setAttribute('size', String(size));
    loader.setAttribute('density', String(density));
    loader.setAttribute('theme', 'dark');
    loader.setAttribute('paused', '');
    loaders.push(loader);
    container.append(loader);
  }
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  loaders.forEach((loader) => loader.removeAttribute('paused'));
  status.textContent = `Warming up ${count} loaders for ${warmupMilliseconds} ms…`;
  await wait(warmupMilliseconds);

  status.textContent = `Sampling frame intervals for ${sampleMilliseconds} ms…`;
  const intervals: number[] = [];
  const longTasks: PerformanceEntry[] = [];
  const observer =
    'PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('longtask')
      ? new PerformanceObserver((list) => longTasks.push(...list.getEntries()))
      : undefined;
  observer?.observe({ type: 'longtask', buffered: false });
  let previous = performance.now();
  let active = true;
  const observeFrame = (timestamp: number) => {
    intervals.push(timestamp - previous);
    previous = timestamp;
    if (active) requestAnimationFrame(observeFrame);
  };
  requestAnimationFrame(observeFrame);
  await wait(sampleMilliseconds);
  active = false;
  observer?.disconnect();

  const sampledDuration = intervals.reduce((total, interval) => total + interval, 0);
  const result: BrowserBenchmarkResult = {
    count,
    density,
    size,
    scenario,
    refreshPeriod,
    effectiveFps: intervals.length / (sampledDuration / 1000),
    intervalP50: percentile(intervals, 0.5),
    intervalP95: percentile(intervals, 0.95),
    intervalP99: percentile(intervals, 0.99),
    intervalMax: Math.max(...intervals),
    overOneAndHalfBudget: intervals.filter((interval) => interval > refreshPeriod * 1.5).length / intervals.length,
    overTwoAndHalfBudget: intervals.filter((interval) => interval > refreshPeriod * 2.5).length / intervals.length,
    longTasks: longTasks.length,
    userAgent: navigator.userAgent,
  };
  window.__benchmarkResult = result;
  output.textContent = JSON.stringify(result, null, 2);
  status.textContent = `Complete: ${result.effectiveFps.toFixed(1)} effective FPS, ${result.intervalP95.toFixed(2)} ms p95 frame interval.`;
  if (button) button.disabled = false;
}

window.__benchmarkReady = true;
if (parameters.has('run') || parameters.has('count')) void run();
