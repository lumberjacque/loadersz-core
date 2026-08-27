import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { circuitFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'coding' as const;
/** Imperative controller permanently bound to the coding animation. */
export const LoaderszLoader = createFixedModeLoader(state, circuitFrame);
/** Native element constructor permanently bound to the coding animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
