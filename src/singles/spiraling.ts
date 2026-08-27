import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { galaxyFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'spiraling' as const;
/** Imperative controller permanently bound to the spiraling animation. */
export const LoaderszLoader = createFixedModeLoader(state, galaxyFrame);
/** Native element constructor permanently bound to the spiraling animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
