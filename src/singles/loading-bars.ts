import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { barsFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'loading-bars' as const;
/** Imperative controller bound to animated loading bars. */
export const LoaderszLoader = createFixedModeLoader(state, barsFrame);
/** Native element constructor bound to animated loading bars. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
