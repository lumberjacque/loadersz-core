import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { tunnelFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'dreaming' as const;
/** Imperative controller permanently bound to the dreaming animation. */
export const LoaderszLoader = createFixedModeLoader(state, tunnelFrame);
/** Native element constructor permanently bound to the dreaming animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
