import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { maskFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'masking' as const;
/** Imperative controller bound to a moving image mask. */
export const LoaderszLoader = createFixedModeLoader(state, maskFrame);
/** Native element constructor bound to a moving image mask. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
