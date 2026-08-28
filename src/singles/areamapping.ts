import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { areaFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'areamapping' as const;
/** Imperative controller permanently bound to the areamapping animation. */
export const LoaderszLoader = createFixedModeLoader(state, areaFrame);
/** Native element constructor permanently bound to the areamapping animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
