import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { helixFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'growing' as const;
/** Imperative controller permanently bound to the growing animation. */
export const LoaderszLoader = createFixedModeLoader(state, helixFrame);
/** Native element constructor permanently bound to the growing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
