import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { linkFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'linking' as const;
/** Imperative controller permanently bound to the linking animation. */
export const LoaderszLoader = createFixedModeLoader(state, linkFrame);
/** Native element constructor permanently bound to the linking animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
