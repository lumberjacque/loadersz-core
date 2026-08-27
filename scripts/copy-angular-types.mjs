import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

await copyFile(
  resolve(root, '.angular-build', 'adapters', 'angular.d.ts'),
  resolve(root, 'dist', 'adapters', 'angular.d.ts'),
);
