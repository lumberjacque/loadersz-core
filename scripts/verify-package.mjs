import { access, readFile, readdir } from 'node:fs/promises';
import { execFile as executeFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

const execFile = promisify(executeFile);
const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = resolve(root, 'package.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const singleModes = (await readdir(resolve(root, 'src', 'singles')))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => file.slice(0, -'.ts'.length))
  .sort();
const requiredFiles = [
  'dist/loadersz.js',
  'dist/loadersz.d.ts',
  'dist/states.js',
  'dist/states.d.ts',
  'dist/modes.js',
  'dist/modes.d.ts',
  'dist/react.js',
  'dist/adapters/react.d.ts',
  'dist/vue.js',
  'dist/adapters/vue.d.ts',
  'dist/svelte.js',
  'dist/adapters/svelte.d.ts',
  'dist/angular.js',
  'dist/adapters/angular.d.ts',
  'README.md',
  'LICENSE',
  ...singleModes.flatMap((state) => [`dist/${state}.js`, `dist/singles/${state}.d.ts`]),
];
const declarationImport = /(?:from\s+['"]|import\s+['"]|import\(\s*['"])(\.{1,2}\/[^'"?#]+)(?:['"])/g;
const DEFAULT_SINGLE_MODE_GZIP_BUDGET = 4 * 1024;
const COMPLEX_SINGLE_MODE_GZIP_BUDGET = 5 * 1024;
const COMPLEX_SINGLE_MODES = new Set(['batching', 'bubble-charting', 'gauging', 'solving']);

const fail = (message) => {
  throw new Error(`Package verification failed: ${message}`);
};

if (manifest.private) fail('package must be publishable (`private` must be false).');
if (manifest.name !== 'loadersz') fail('package name must be `loadersz`.');
if (manifest.license !== 'MIT') fail('license must be MIT.');
if (manifest.type !== 'module') fail('package must be ESM.');
if (!Array.isArray(manifest.sideEffects) || !manifest.sideEffects.includes('./dist/loadersz.js'))
  fail('custom-element entry points must be retained as side effects.');
if (manifest.exports?.['.']?.import !== './dist/loadersz.js') fail('root ESM export must target dist/loadersz.js.');
if (manifest.exports?.['.']?.types !== './dist/loadersz.d.ts')
  fail('root types export must target dist/loadersz.d.ts.');
if (manifest.exports?.['./react']?.import !== './dist/react.js') fail('React ESM export must target dist/react.js.');
if (manifest.exports?.['./react']?.types !== './dist/adapters/react.d.ts')
  fail('React types export must target dist/adapters/react.d.ts.');
if (manifest.exports?.['./vue']?.import !== './dist/vue.js') fail('Vue ESM export must target dist/vue.js.');
if (manifest.exports?.['./vue']?.types !== './dist/adapters/vue.d.ts')
  fail('Vue types export must target dist/adapters/vue.d.ts.');
if (manifest.exports?.['./svelte']?.import !== './dist/svelte.js')
  fail('Svelte ESM export must target dist/svelte.js.');
if (manifest.exports?.['./svelte']?.types !== './dist/adapters/svelte.d.ts')
  fail('Svelte types export must target dist/adapters/svelte.d.ts.');
if (manifest.exports?.['./angular']?.import !== './dist/angular.js')
  fail('Angular ESM export must target dist/angular.js.');
if (manifest.exports?.['./angular']?.types !== './dist/adapters/angular.d.ts')
  fail('Angular types export must target dist/adapters/angular.d.ts.');
if (manifest.exports?.['./modes']?.import !== './dist/modes.js') fail('Modes ESM export must target dist/modes.js.');
if (manifest.exports?.['./modes']?.types !== './dist/modes.d.ts')
  fail('Modes types export must target dist/modes.d.ts.');
if (manifest.exports?.['./states']?.import !== './dist/states.js')
  fail('States ESM export must target dist/states.js.');
if (manifest.exports?.['./states']?.types !== './dist/states.d.ts')
  fail('States types export must target dist/states.d.ts.');
if (manifest.exports?.['./*']?.import !== './dist/*.js')
  fail('single-mode ESM exports must target their individual dist files.');
if (manifest.exports?.['./*']?.types !== './dist/singles/*.d.ts')
  fail('single-mode type exports must target their individual declarations.');
for (const state of singleModes) {
  if (!manifest.sideEffects.includes(`./dist/${state}.js`))
    fail(`single-mode entry ${state} must be retained as a custom-element side effect.`);
}
if (Object.keys(manifest.dependencies ?? {}).length > 0) fail('published package must not have runtime dependencies.');
if (
  manifest.scripts?.install ||
  manifest.scripts?.preinstall ||
  manifest.scripts?.postinstall ||
  manifest.scripts?.prepare
) {
  fail('consumer lifecycle scripts are not allowed.');
}

for (const file of requiredFiles) {
  try {
    await access(resolve(root, file));
  } catch {
    fail(`required publish file is missing: ${file}`);
  }
}

for (const file of ['dist/adapters/react.d.ts', 'dist/singles/racing.d.ts']) {
  const declaration = await readFile(resolve(root, file), 'utf8');
  const invalidSpecifier = [...declaration.matchAll(declarationImport)].find(
    ([, specifier]) => !specifier.endsWith('.js'),
  );
  if (invalidSpecifier) fail(`${file} must use explicit .js extensions for NodeNext-compatible declaration imports.`);
}

for (const state of singleModes) {
  const entry = await readFile(resolve(root, 'dist', `${state}.js`));
  if (entry.includes('from "./')) fail(`single-mode entry ${state} must be self-contained.`);
  const gzipBudget = COMPLEX_SINGLE_MODES.has(state)
    ? COMPLEX_SINGLE_MODE_GZIP_BUDGET
    : DEFAULT_SINGLE_MODE_GZIP_BUDGET;
  if (gzipSync(entry).byteLength > gzipBudget)
    fail(`single-mode entry ${state} exceeds its ${gzipBudget / 1024} kB gzip size budget.`);
}

const registeredElements = new Map();
globalThis.HTMLElement ??= class HTMLElement {};
globalThis.customElements ??= {
  define(name, constructor) {
    registeredElements.set(name, constructor);
  },
  get(name) {
    return registeredElements.get(name);
  },
};

const importBuild = (file) => import(pathToFileURL(resolve(root, file)).href);

const verifyEntryRegistration = async (file) => {
  const entryUrl = pathToFileURL(resolve(root, file)).href;
  const program = `
    globalThis.HTMLElement = class HTMLElement {};
    const registered = new Map();
    globalThis.customElements = {
      define(name, constructor) { registered.set(name, constructor); },
      get(name) { return registered.get(name); },
    };
    await import(${JSON.stringify(entryUrl)});
    if (!customElements.get('loadersz-loader')) {
      throw new Error('The custom element was not registered.');
    }
  `;

  try {
    await execFile(process.execPath, ['--input-type=module', '--eval', program], { cwd: root });
  } catch {
    fail(`${file} must register the custom element when imported independently.`);
  }
};

for (const file of ['dist/react.js', 'dist/vue.js', 'dist/svelte.js']) {
  await verifyEntryRegistration(file);
}

const angularEntry = await readFile(resolve(root, 'dist/angular.js'), 'utf8');
if (!angularEntry.includes('ɵɵngDeclareDirective'))
  fail('Angular entry must contain partial-compiled directive metadata for AOT builds.');
if (angularEntry.includes('registerLoadersz'))
  fail('Angular directive entry must not pull every loader into fixed-state bundles.');
const angularDeclaration = await readFile(resolve(root, 'dist/adapters/angular.d.ts'), 'utf8');
if (!angularDeclaration.includes('ɵdir'))
  fail('Angular declaration must expose directive metadata to the Angular compiler.');

const rootEntry = await importBuild('dist/loadersz.js');
if (typeof rootEntry.LoaderszLoader !== 'function') fail('root entry must expose the imperative controller.');
if (!customElements.get('loadersz-loader')) fail('root entry must register the custom element.');

const statesEntry = await importBuild('dist/states.js');
if (!Array.isArray(statesEntry.LOADER_STATES) || statesEntry.LOADER_STATES.length !== singleModes.length)
  fail('states entry must expose every direct-import state.');

for (const state of singleModes) {
  const entry = await importBuild(`dist/${state}.js`);
  if (entry.state !== state) fail(`single-mode entry ${state} exported an incorrect state.`);
  if (typeof entry.LoaderszLoader !== 'function') fail(`single-mode entry ${state} must expose a controller.`);
  if (typeof entry.LoaderszLoaderElement !== 'function')
    fail(`single-mode entry ${state} must expose an element constructor.`);
}

for (const file of ['dist/modes.js', 'dist/react.js', 'dist/vue.js', 'dist/svelte.js']) await importBuild(file);

console.log(`Package verification passed for ${manifest.name}@${manifest.version}.`);
