import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { resonanceFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'resonating' as const;
/** Imperative controller permanently bound to the resonating animation. */
export const LoaderszLoader = createFixedModeLoader(state, resonanceFrame);
/** Native element constructor permanently bound to the resonating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
