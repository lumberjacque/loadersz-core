import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { haloFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'observing' as const;
/** Imperative controller permanently bound to the observing animation. */
export const LoaderszLoader = createFixedModeLoader(state, haloFrame);
/** Native element constructor permanently bound to the observing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
