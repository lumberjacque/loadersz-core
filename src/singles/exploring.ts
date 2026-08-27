import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { exploreFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'exploring' as const;
/** Imperative controller permanently bound to the exploring animation. */
export const LoaderszLoader = createFixedModeLoader(state, exploreFrame);
/** Native element constructor permanently bound to the exploring animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
