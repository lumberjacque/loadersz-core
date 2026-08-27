import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { forgeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'forging' as const;
/** Imperative controller permanently bound to the forging animation. */
export const LoaderszLoader = createFixedModeLoader(state, forgeFrame);
/** Native element constructor permanently bound to the forging animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
