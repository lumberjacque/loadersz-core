import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { orbitdotsFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'orbiting-dots' as const;
/** Imperative controller bound to the three-orbit loader. */
export const LoaderszLoader = createFixedModeLoader(state, orbitdotsFrame);
/** Native element constructor bound to the three-orbit loader. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
