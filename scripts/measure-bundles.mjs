import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const valueAfter = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? fallback : process.argv[index + 1];
};
const directory = resolve(valueAfter('--dir', 'dist'));
const output = valueAfter('--output');
const files = (await readdir(directory)).filter((file) => file.endsWith('.js')).sort();
const entries = {};
for (const file of files) {
  const contents = await readFile(resolve(directory, file));
  const stableName = file.replace(/-[A-Za-z0-9_-]{8}\.js$/, '-[chunk].js');
  entries[stableName] = {
    file,
    raw: contents.byteLength,
    gzip: gzipSync(contents, { level: 9 }).byteLength,
    brotli: brotliCompressSync(contents, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).byteLength,
  };
}
const result = {
  generatedAt: new Date().toISOString(),
  directory: relative(process.cwd(), directory).replaceAll('\\', '/') || '.',
  entries,
};
const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (output) {
  const outputPath = resolve(output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized);
  console.log(`Bundle sizes: ${outputPath}`);
}
console.log(serialized);
