import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true,
    // The custom element is also used directly, outside framework bundlers,
    // so publish syntax supported by the broad ES2017 browser baseline.
    target: 'es2017',
    lib: {
      entry: {
        loadersz: 'src/loadersz.ts',
        modes: 'src/modes.ts',
        react: 'src/adapters/react.ts',
        vue: 'src/adapters/vue.ts',
        svelte: 'src/adapters/svelte.ts',
        angular: '.angular-build/adapters/angular.js',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['@angular/core', 'react', 'vue', 'svelte', 'svelte/elements'],
    },
  },
});
