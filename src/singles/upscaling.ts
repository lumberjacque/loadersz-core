import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { upscaleFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'upscaling' as const;
/** Imperative controller bound to a progressive pixel upscaler. */
export const LoaderszLoader = createFixedModeLoader(state, upscaleFrame);
/** Native element constructor bound to a progressive pixel upscaler. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
