import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { matrixFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'decoding' as const;
/** Imperative controller permanently bound to the decoding animation. */
export const LoaderszLoader = createFixedModeLoader(state, matrixFrame);
/** Native element constructor permanently bound to the decoding animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
