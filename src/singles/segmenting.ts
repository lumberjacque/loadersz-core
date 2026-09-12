import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { segmentFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'segmenting' as const;
/** Imperative controller bound to image-region segmentation. */
export const LoaderszLoader = createFixedModeLoader(state, segmentFrame);
/** Native element constructor bound to image-region segmentation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
