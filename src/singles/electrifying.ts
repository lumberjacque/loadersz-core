import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { plasmaFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'electrifying' as const;
/** Imperative controller permanently bound to the electrifying animation. */
export const LoaderszLoader = createFixedModeLoader(state, plasmaFrame);
/** Native element constructor permanently bound to the electrifying animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
