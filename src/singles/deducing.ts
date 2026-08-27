import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { deduceFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'deducing' as const;
/** Imperative controller permanently bound to the deducing animation. */
export const LoaderszLoader = createFixedModeLoader(state, deduceFrame);
/** Native element constructor permanently bound to the deducing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
