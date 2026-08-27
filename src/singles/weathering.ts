import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { vortexFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'weathering' as const;
/** Imperative controller permanently bound to the weathering animation. */
export const LoaderszLoader = createFixedModeLoader(state, vortexFrame);
/** Native element constructor permanently bound to the weathering animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
