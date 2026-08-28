import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { comparisonFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'comparing' as const;
/** Imperative controller permanently bound to the comparing animation. */
export const LoaderszLoader = createFixedModeLoader(state, comparisonFrame);
/** Native element constructor permanently bound to the comparing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
