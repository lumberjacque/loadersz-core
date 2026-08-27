import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { constellationFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'constellating' as const;
/** Imperative controller permanently bound to the constellating animation. */
export const LoaderszLoader = createFixedModeLoader(state, constellationFrame);
/** Native element constructor permanently bound to the constellating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
