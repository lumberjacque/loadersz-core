import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { bubblesFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'bubbling' as const;
/** Imperative controller permanently bound to the bubbling animation. */
export const LoaderszLoader = createFixedModeLoader(state, bubblesFrame);
/** Native element constructor permanently bound to the bubbling animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
