import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { inpaintFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'inpainting' as const;
/** Imperative controller bound to a pixel restoration pass. */
export const LoaderszLoader = createFixedModeLoader(state, inpaintFrame);
/** Native element constructor bound to a pixel restoration pass. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
