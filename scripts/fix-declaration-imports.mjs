import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const declarationsRoot = resolve(root, 'dist');
const importSpecifier = /(from\s+['"]|import\s+['"]|import\(\s*['"])(\.{1,2}\/[^'"?#]+)(['"])/g;

/**
 * Collects declaration files below a directory without following external paths.
 *
 * @param {string} directory Directory to visit.
 * @returns {Promise<string[]>} Absolute declaration file paths.
 */
async function collectDeclarationFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collectDeclarationFiles(path);
      return entry.isFile() && entry.name.endsWith('.d.ts') ? [path] : [];
    }),
  );

  return files.flat();
}

/**
 * Adds `.js` to relative declaration import specifiers for NodeNext consumers.
 *
 * TypeScript maps these JavaScript specifiers back to their matching `.d.ts`
 * files while NodeNext requires the emitted ESM extension to be explicit.
 *
 * @param {string} source Declaration file contents.
 * @returns {string} NodeNext-compatible declaration contents.
 */
function addJavaScriptExtensions(source) {
  return source.replace(importSpecifier, (match, prefix, specifier, suffix) => {
    if (/\.(?:[cm]?js|json|node)$/.test(specifier)) return match;
    return `${prefix}${specifier}.js${suffix}`;
  });
}

for (const file of await collectDeclarationFiles(declarationsRoot)) {
  const source = await readFile(file, 'utf8');
  const transformed = addJavaScriptExtensions(source);
  if (transformed !== source) await writeFile(file, transformed);
}
