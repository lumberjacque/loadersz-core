/**
 * loadersz package entry point. Importing this module registers `<loadersz-loader>` once per page
 * and also exposes the imperative controller for callers that own a canvas themselves.
 */
export { LoaderszLoader } from './core/LoaderszOrb';
export { LoaderszLoaderElement } from './core/LoaderszOrbElement';
export type {
  LoaderszOrbOptions as LoaderszLoaderOptions,
  OrbMode as LoaderMode,
  OrbState as LoaderState,
  OrbTheme as LoaderTheme,
} from './core/types';

import { LoaderszLoaderElement } from './core/LoaderszOrbElement';

/**
 * Registers the native `<loadersz-loader>` custom element exactly once.
 *
 * The package registers itself automatically when it is imported. Exporting the
 * registration step also gives bundlers a concrete call to retain when the
 * source entry point is consumed by an application or documentation site.
 *
 * @returns Nothing. Calling this function repeatedly is safe.
 */
export function registerLoadersz(): void {
  if (typeof customElements !== 'undefined' && !customElements.get('loadersz-loader')) {
    customElements.define('loadersz-loader', LoaderszLoaderElement);
  }
}

registerLoadersz();
