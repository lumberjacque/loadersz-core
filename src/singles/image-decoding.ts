import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { imageDecodeFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'image-decoding' as const;
/** Imperative controller bound to a progressive image decoder. */
export const LoaderszLoader = createFixedModeLoader(state, imageDecodeFrame);
/** Native element constructor bound to a progressive image decoder. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
