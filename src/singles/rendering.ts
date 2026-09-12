import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { renderFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'rendering' as const;
/** Imperative controller bound to a progressive tile renderer. */
export const LoaderszLoader = createFixedModeLoader(state, renderFrame);
/** Native element constructor bound to a progressive tile renderer. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
