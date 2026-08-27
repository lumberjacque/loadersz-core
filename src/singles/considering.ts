import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { considerFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'considering' as const;
/** Imperative controller permanently bound to the considering animation. */
export const LoaderszLoader = createFixedModeLoader(state, considerFrame);
/** Native element constructor permanently bound to the considering animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
