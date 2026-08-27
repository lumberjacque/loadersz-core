import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { waveFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'listening' as const;
/** Imperative controller permanently bound to the listening animation. */
export const LoaderszLoader = createFixedModeLoader(state, waveFrame);
/** Native element constructor permanently bound to the listening animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
