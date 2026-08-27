import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { weaveFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'weaving' as const;
/** Imperative controller permanently bound to the weaving animation. */
export const LoaderszLoader = createFixedModeLoader(state, weaveFrame);
/** Native element constructor permanently bound to the weaving animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
