import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { knotFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'flowing' as const;
/** Imperative controller permanently bound to the flowing animation. */
export const LoaderszLoader = createFixedModeLoader(state, knotFrame);
/** Native element constructor permanently bound to the flowing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
