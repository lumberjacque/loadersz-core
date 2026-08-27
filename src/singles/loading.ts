import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { spinnerFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'loading' as const;
/** Imperative controller permanently bound to the loading animation. */
export const LoaderszLoader = createFixedModeLoader(state, spinnerFrame);
/** Native element constructor permanently bound to the loading animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
