import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { unblurFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'unblurring' as const;
/** Imperative controller bound to a resolving image field. */
export const LoaderszLoader = createFixedModeLoader(state, unblurFrame);
/** Native element constructor bound to a resolving image field. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
