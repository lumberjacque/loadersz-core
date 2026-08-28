import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { stackedFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'accumulating' as const;
/** Imperative controller permanently bound to the accumulating animation. */
export const LoaderszLoader = createFixedModeLoader(state, stackedFrame);
/** Native element constructor permanently bound to the accumulating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
