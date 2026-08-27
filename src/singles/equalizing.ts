import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { equalizerFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'equalizing' as const;
/** Imperative controller bound to the equalizer bars. */
export const LoaderszLoader = createFixedModeLoader(state, equalizerFrame);
/** Native element constructor bound to the equalizer bars. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
