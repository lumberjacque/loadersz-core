import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { scatterFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'sampling' as const;
/** Imperative controller bound to a moving scatter sample. */
export const LoaderszLoader = createFixedModeLoader(state, scatterFrame);
/** Native element constructor bound to the moving scatter sample. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
