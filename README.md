# loadersz

[![npm version](https://img.shields.io/npm/v/loadersz?style=flat-square&logo=npm&label=npm)](https://www.npmjs.com/package/loadersz)
[![npm downloads](https://img.shields.io/npm/dm/loadersz?style=flat-square&logo=npm&label=downloads)](https://www.npmjs.com/package/loadersz)
[![CI](https://github.com/lumberjacque/loadersz-core/actions/workflows/ci.yml/badge.svg)](https://github.com/lumberjacque/loadersz-core/actions/workflows/ci.yml)
[![bundle size](https://deno.bundlejs.com/?q=loadersz&badge=detailed&badge-style=flat)](https://bundlejs.com/?q=loadersz)
[![single loader size](https://deno.bundlejs.com/badge?q=loadersz/typing&treeshake=[*])](#single-mode-imports)
[![motion states](https://img.shields.io/badge/motion%20states-150-6f8cff?style=flat-square)](#states)
[![license](https://img.shields.io/npm/l/loadersz?style=flat-square&label=license)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![core dependencies](https://img.shields.io/badge/core%20dependencies-0-2ea44f?style=flat-square)](#accessibility-and-performance)

Framework-agnostic, dependency-free Canvas loaders for the browser. `loadersz` ships as a native Web Component and a small imperative TypeScript API-no React, SVG filters, or runtime dependencies.

**150 motion states. One fixed state is 2.5–3.1 kB gzipped; the complete switchable library is available from one import.**

## Install

```sh
npm install loadersz
```

### Enumerate available states

Use the tiny, side-effect-free states entry when building a picker or documentation UI:

```ts
import { LOADER_STATES } from "loadersz/states";

console.log(LOADER_STATES); // ["working", "searching", …]
```

Use the category metadata when building a picker or gallery. It keeps product-style loaders,
loaders, systems, data & telemetry, reasoning, atmosphere and motion studies in the same order as the official website:

```ts
import { LOADER_CATEGORIES } from "loadersz/states";

for (const category of LOADER_CATEGORIES) {
  console.log(category.label, category.states);
}
```

Import once in your application to register the custom element safely:

```ts
import "loadersz";
```

## Custom element

```html
<loadersz-loader
  state="calibrating"
  size="144"
  speed="1.15"
  density="1"
  theme="dark"
  aria-label="Calibrating"
></loadersz-loader>
```

`size` is required in practice: it is the square canvas side in CSS pixels. Use `64` for a compact status indicator, `144` for a card, or `280` for a hero-sized loader.

### Attributes

| Attribute         | Type                    | Default   | Description                                                       |
| ----------------- | ----------------------- | --------- | ----------------------------------------------------------------- |
| `state`           | state name              | `working` | Selects the visual geometry.                                      |
| `size`            | number                  | `96`      | Square side in CSS pixels; values below `16` are clamped.         |
| `speed`           | number                  | `1`       | Timeline multiplier.                                              |
| `density`         | number                  | `1`       | Geometry detail; clamped to `0.35`–`2`.                           |
| `particle-radius` | number                  | `1`       | Multiplies visible particle thickness; clamped to `0.5`–`2.5`.    |
| `theme`           | `auto`, `dark`, `light` | `auto`    | Canvas colour scheme.                                             |
| `hue`             | `0`–`360`               | unset     | Overrides a mode's native colour palette.                         |
| `color`           | CSS colour string       | unset     | Overrides `hue`; accepts hex, CSS colours, and `var(--token)`.    |
| `paused`          | boolean attribute       | unset     | Stops frame scheduling and keeps the current frame visible.       |
| `force-motion`    | boolean attribute       | unset     | Overrides a reduced-motion preference; use only when appropriate. |
| `aria-label`      | string                  | `Loading` | Accessible label applied to the internal canvas.                  |

### Colour modes

Omit both `hue` and `color` to preserve the loader's native treatment. That can be a multi-colour palette or deliberately monochrome grey, depending on the movement. Set `hue` to recolour every visible particle with one hue, or set `color` for one exact CSS colour. `color` takes precedence over `hue`.

### States

`working`, `searching`, `connecting`, `weaving`, `shaping`, `listening`, `breathing`, `composing`, `solving`, `observing`, `dreaming`, `charging`, `flowing`, `awakening`, `coding`, `transcending`, `singing`, `growing`, `blooming`, `wandering`, `decoding`, `calibrating`, `attracting`, `shattering`, `crystallizing`, `constellating`, `folding`, `echoing`, `balancing`, `weathering`, `mapping`, `forging`, `orbiting`, `racing`, `bubbling`, `spinning`, `electrifying`, `flocking`, `throbbing`, `cascading`, `spiraling`, `juggling`, `eclipsing`, `resonating`, `condensing`, `dispersing`, `prisming`, `levitating`, `synchronizing`, `unraveling`, `pondering`, `deducing`, `branching`, `focusing`, `reflecting`, `weighing`, `recalling`, `tracing`, `converging`, `questioning`, `glimmering`, `radiating`, `harmonizing`, `twinkling`, `flickering`, `shimmering`, `surfacing`, `vibrating`, `illuminating`, `sparkling`, `loading`, `buffering`, `typing`, `processing`, `synthesizing`, `considering`, `uploading`, `queuing`, `associating`, `evaluating`, `reasoning`, `exploring`, `linking`, `resolving`, and `imagining`.

## Framework adapters

The core package remains a native Web Component. Typed adapters are available for the three frameworks that need framework-specific TypeScript or component integration.

### React

```tsx
import { LoaderszLoader } from "loadersz/react";

export function Status() {
  return (
    <LoaderszLoader
      state="racing"
      size={144}
      speed={1.2}
      ariaLabel="Loading results"
    />
  );
}
```

Importing `loadersz/react` also adds type support for direct custom-element JSX:

```tsx
import "loadersz/react";

const loader = <loadersz-loader state="orbiting" size={96} />;
```

### Vue 3

```vue
<script setup lang="ts">
import { LoaderszLoader } from "loadersz/vue";
</script>

<template>
  <LoaderszLoader
    state="bubbling"
    :size="144"
    :speed="1.1"
    aria-label="Loading"
  />
</template>
```

### Svelte 4 and 5

```svelte
<script lang="ts">
  import 'loadersz/svelte';
</script>

<loadersz-loader state="spiraling" size={144} aria-label="Loading" />
```

### Angular

Use the standalone Angular directive. It makes the native element known to Angular and adds typed bindings without `CUSTOM_ELEMENTS_SCHEMA`. The runtime import is intentionally explicit, so the same pattern works with a small direct state import. Keep the loader in normal HTML — never inside an `<svg>` or `<defs>` block.

```ts
import { Component } from "@angular/core";
import "loadersz";
import { LoaderszLoader } from "loadersz/angular";

@Component({
  standalone: true,
  selector: "app-root",
  imports: [LoaderszLoader],
  template: `
    <loadersz-loader
      [state]="state"
      [size]="144"
      aria-label="Loading"
    ></loadersz-loader>
  `,
})
export class App {
  readonly state = "racing" as const;
}
```

For Solid, Qwik, Lit, and plain HTML, import `loadersz` and use `<loadersz-loader>` directly.

### Which import should I use?

| Framework              | Loader can change at runtime                      | One fixed loader                                                        |
| ---------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| React                  | `import { LoaderszLoader } from 'loadersz/react'` | `import 'loadersz/racing'` plus React's type-only import below          |
| Vue 3                  | `import { LoaderszLoader } from 'loadersz/vue'`   | `import 'loadersz/racing'` and use the native element                   |
| Svelte                 | `import 'loadersz/svelte'`                        | `import 'loadersz/racing'` plus `import type {} from 'loadersz/svelte'` |
| Angular                | `import 'loadersz'` + `LoaderszLoader`            | `import 'loadersz/racing'` + `LoaderszLoader`                           |
| Lit, Solid, Qwik, HTML | `import 'loadersz'`                               | `import 'loadersz/racing'`                                              |

The controls are always the same. The native element spells its multi-word attributes as `aria-label`, `force-motion`, and `particle-radius`; React and Vue wrappers spell them as `ariaLabel`, `forceMotion`, and `particleRadius`. `state`, `size`, `speed`, `density`, `hue`, `color`, `theme`, and `paused` keep the same name.

## Single-mode imports

When a loader will never change state, use its direct entry point. It includes the Canvas core and exactly one geometry builder-no tree-shaking configuration required.

```ts
import "loadersz/racing";
```

```html
<loadersz-loader
  state="racing"
  size="144"
  speed="1.15"
  aria-label="Loading results"
></loadersz-loader>
```

The direct entry's visual state is fixed by its import. The `state` attribute is accepted so markup stays familiar, but cannot load the other 84 animations. Every state name has a matching entry point: `loadersz/working`, `loadersz/solving`, `loadersz/racing`, and so on.

In React, a direct entry can stay small too. Import the fixed runtime entry and the adapter types only; TypeScript removes the type-only import from the browser bundle.

```tsx
import "loadersz/racing";
import type { LoaderszReactProps } from "loadersz/react";

const loaderProps = { state: "racing", size: 96 } satisfies LoaderszReactProps;

export function Loading() {
  return <loadersz-loader {...loaderProps} aria-label="Loading" />;
}
```

The direct import itself is framework-agnostic: it always registers the same native element and supports the same `state`, `size`, `speed`, `density`, `hue`, `color`, `theme`, `paused`, and `force-motion` attributes. Framework wrapper types are intentionally specific to their framework: use `LoaderszReactProps` for React, `loadersz/vue` for the typed Vue component, and `import type {} from 'loadersz/svelte'` alongside a direct entry for Svelte template typing. The Vue wrapper imports the complete switchable component, so use the native element when the smallest single-state bundle matters.

For a fixed canvas you own yourself, the same entry point exposes a fixed imperative controller:

```ts
import { LoaderszLoader } from "loadersz/racing";

const canvas = document.querySelector<HTMLCanvasElement>("#loading");
if (!canvas) throw new Error("Missing canvas");

const loader = new LoaderszLoader(canvas, {
  size: 144,
  speed: 1.15,
  ariaLabel: "Loading results",
});
```

Use the root import when a component must change between states at runtime:

```ts
import "loadersz";
```

`loadersz/modes` remains available for applications that want named fixed-mode factories and already rely on an ESM-aware production bundler:

```ts
import { racing } from "loadersz/modes";

const canvas = document.querySelector<HTMLCanvasElement>("#loading");
if (!canvas) throw new Error("Missing canvas");

const loader = racing(canvas, {
  size: 144,
  speed: 1.15,
  ariaLabel: "Loading results",
});
```

The returned controller still supports `setOptions`, `paused`, colour, speed, density, and `destroy()`. Its visual mode is fixed to the imported factory.

## Imperative API

Use the imperative API when your application owns a canvas or controls the lifecycle directly.

```ts
import { LoaderszLoader } from "loadersz";

const canvas = document.querySelector<HTMLCanvasElement>("#loader");
if (!canvas) throw new Error("Missing canvas");

const loader = new LoaderszLoader(canvas, {
  state: "solving",
  size: 160,
  speed: 1.1,
  theme: "dark",
  ariaLabel: "Solving",
});

loader.setOptions({ state: "forging", size: 200, hue: 28 });
loader.destroy();
```

All exported types and methods include TSDoc, so editors show parameter descriptions, defaults, return values, and lifecycle behaviour on hover.

## Accessibility and performance

- Respects `prefers-reduced-motion` by default and pauses in hidden tabs.
- Canvas device-pixel ratio is capped at `2` to avoid excessive bitmap work.
- The core has **zero regular runtime dependencies**. React, Vue, and Svelte are optional peer dependencies and are only needed when importing their adapter entry point.
- Use a meaningful `aria-label` for non-decorative loaders. Use `aria-hidden="true"` on a decorative surrounding element where appropriate.

## Development

Install dependencies and enable the local Git hooks once:

```bash
npm install
npm run hooks:install
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). Pre-commit checks format and lint staged files. The release package intentionally contains no install lifecycle scripts.

### Browser benchmark UI

Start the interactive production-build benchmark:

```bash
npm run benchmark:ui
```

Open <http://127.0.0.1:4174>, choose a scenario, and select **Run benchmark**. Stop the local server with `Ctrl+C`. See [BENCHMARKING.md](BENCHMARKING.md) for A/B comparisons, equivalence checks, CI behaviour, and measurement rules.

## License

[MIT](LICENSE) © 2026 lumberjacque.
