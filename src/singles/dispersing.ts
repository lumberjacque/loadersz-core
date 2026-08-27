import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { disperseFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'dispersing' as const;
/** Imperative controller permanently bound to the dispersing animation. */
export const LoaderszLoader = createFixedModeLoader(state, disperseFrame);
/** Native element constructor permanently bound to the dispersing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
