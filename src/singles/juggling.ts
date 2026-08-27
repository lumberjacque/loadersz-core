import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { juggleFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'juggling' as const;
/** Imperative controller permanently bound to the juggling animation. */
export const LoaderszLoader = createFixedModeLoader(state, juggleFrame);
/** Native element constructor permanently bound to the juggling animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
