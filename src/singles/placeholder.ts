import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { skeletonFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'placeholder' as const;
/** Imperative controller bound to the skeleton placeholder. */
export const LoaderszLoader = createFixedModeLoader(state, skeletonFrame);
/** Native element constructor bound to the skeleton placeholder. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
