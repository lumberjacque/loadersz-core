import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { treemapFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'treemapping' as const;
/** Imperative controller permanently bound to the treemapping animation. */
export const LoaderszLoader = createFixedModeLoader(state, treemapFrame);
/** Native element constructor permanently bound to the treemapping animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
