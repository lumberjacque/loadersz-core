import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { branchFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'branching' as const;
/** Imperative controller permanently bound to the branching animation. */
export const LoaderszLoader = createFixedModeLoader(state, branchFrame);
/** Native element constructor permanently bound to the branching animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
