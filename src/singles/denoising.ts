import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { denoiseFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'denoising' as const;
/** Imperative controller bound to a pixel denoising pass. */
export const LoaderszLoader = createFixedModeLoader(state, denoiseFrame);
/** Native element constructor bound to a pixel denoising pass. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
