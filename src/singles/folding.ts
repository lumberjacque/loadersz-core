import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { origamiFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'folding' as const;
/** Imperative controller permanently bound to the folding animation. */
export const LoaderszLoader = createFixedModeLoader(state, origamiFrame);
/** Native element constructor permanently bound to the folding animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
