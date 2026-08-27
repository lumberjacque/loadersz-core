import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { bufferFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'buffering' as const;
/** Imperative controller permanently bound to the buffering animation. */
export const LoaderszLoader = createFixedModeLoader(state, bufferFrame);
/** Native element constructor permanently bound to the buffering animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
