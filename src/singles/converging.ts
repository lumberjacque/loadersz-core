import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { convergeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'converging' as const;
/** Imperative controller permanently bound to the converging animation. */
export const LoaderszLoader = createFixedModeLoader(state, convergeFrame);
/** Native element constructor permanently bound to the converging animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
