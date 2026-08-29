import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};

const outDir = resolve(valueAfter('--out-dir', '.benchmark/current'));
await mkdir(outDir, { recursive: true });
await build({
  configFile: false,
  logLevel: 'warn',
  build: {
    target: 'es2017',
    emptyOutDir: true,
    outDir,
    lib: {
      entry: resolve('benchmark/frames-entry.ts'),
      formats: ['es'],
      fileName: () => 'frames.js',
    },
  },
});
console.log(`Benchmark bundle: ${resolve(outDir, 'frames.js')}`);
