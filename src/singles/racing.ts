import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { cometFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'racing' as const;
/** Imperative controller permanently bound to the racing animation. */
export const LoaderszLoader = createFixedModeLoader(state, cometFrame);
/** Native element constructor permanently bound to the racing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
