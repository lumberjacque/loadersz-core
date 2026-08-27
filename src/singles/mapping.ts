import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { atlasFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'mapping' as const;
/** Imperative controller permanently bound to the mapping animation. */
export const LoaderszLoader = createFixedModeLoader(state, atlasFrame);
/** Native element constructor permanently bound to the mapping animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
