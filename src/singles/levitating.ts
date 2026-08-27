import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { levitateFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'levitating' as const;
/** Imperative controller permanently bound to the levitating animation. */
export const LoaderszLoader = createFixedModeLoader(state, levitateFrame);
/** Native element constructor permanently bound to the levitating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
