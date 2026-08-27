import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { radarFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'tracking' as const;
/** Imperative controller bound to the radar sweep. */
export const LoaderszLoader = createFixedModeLoader(state, radarFrame);
/** Native element constructor bound to the radar sweep. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
