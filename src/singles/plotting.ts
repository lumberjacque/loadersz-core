import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { plotFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'plotting' as const;
/** Imperative controller bound to a live signal plot. */
export const LoaderszLoader = createFixedModeLoader(state, plotFrame);
/** Native element constructor bound to the live signal plot. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
