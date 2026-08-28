import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const singleModes = (await readdir(resolve(root, 'src', 'singles')))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.slice(0, -'.ts'.length))
  .sort();

for (const state of singleModes) {
  await build({
    configFile: false,
    logLevel: 'error',
    build: {
      emptyOutDir: false,
      outDir: resolve(root, 'dist'),
      target: 'es2017',
      lib: {
        entry: resolve(root, 'src', 'singles', `${state}.ts`),
        formats: ['es'],
        fileName: () => `${state}.js`,
      },
      rolldownOptions: { output: { codeSplitting: false } },
    },
  });
}
