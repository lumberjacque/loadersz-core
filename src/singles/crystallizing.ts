import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { crystalFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'crystallizing' as const;
/** Imperative controller permanently bound to the crystallizing animation. */
export const LoaderszLoader = createFixedModeLoader(state, crystalFrame);
/** Native element constructor permanently bound to the crystallizing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
