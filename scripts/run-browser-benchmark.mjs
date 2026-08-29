import { createReadStream } from 'node:fs';
import { access, mkdir, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve } from 'node:path';
import { build } from 'vite';
import { chromium, webkit } from '@playwright/test';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};
const output = valueAfter('--output');
const browserName = valueAfter('--browser', 'chromium');
const duration = Number(valueAfter('--duration', '5000'));
const warmup = Number(valueAfter('--warmup', '2000'));
const outDir = resolve('.benchmark/browser');
await build({
  root: resolve('benchmark'),
  base: './',
  logLevel: 'warn',
  build: { target: 'es2017', outDir, emptyOutDir: true },
});

const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1');
  const relative = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = resolve(outDir, relative);
  if (!file.startsWith(outDir)) {
    response.writeHead(403).end();
    return;
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    response.setHeader('content-type', mimeTypes[extname(file)] ?? 'application/octet-stream');
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolveReady) => server.listen(4174, '127.0.0.1', resolveReady));

const browserType = browserName === 'webkit' ? webkit : chromium;
const launchOptions = {};
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
if (browserName === 'chromium') {
  try {
    await access(edge);
    launchOptions.executablePath = edge;
  } catch {}
}

let browser;
try {
  browser = await browserType.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page.on('console', (message) => console.error(`[browser:${message.type()}] ${message.text()}`));
  page.on('pageerror', (error) => console.error(`[browser:error] ${error.stack ?? error.message}`));
  const scenarios = [];
  for (const scenario of ['projector', 'mixed', 'control']) {
    for (const count of [1, 10, 25, 50]) {
      const query = new URLSearchParams({
        scenario,
        count: String(count),
        density: count === 1 ? '1' : '2',
        size: count === 1 ? '96' : '64',
        warmup: String(warmup),
        duration: String(duration),
      });
      await page.goto(`http://127.0.0.1:4174/?${query}`);
      await page.waitForFunction(() => window.__benchmarkResult !== undefined, undefined, {
        timeout: warmup + duration + 15_000,
      });
      scenarios.push(await page.evaluate(() => window.__benchmarkResult));
    }
  }
  const result = {
    generatedAt: new Date().toISOString(),
    browser: browserName,
    duration,
    warmup,
    scenarios,
  };
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (output) {
    const outputPath = resolve(output);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, serialized);
    console.log(`Browser benchmark: ${outputPath}`);
  }
  console.log(serialized);
} finally {
  await browser?.close();
  await new Promise((resolveClosed) => server.close(resolveClosed));
}
