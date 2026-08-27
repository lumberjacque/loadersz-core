import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { reasonFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'synthesizing' as const;
/** Imperative controller permanently bound to the synthesizing animation. */
export const LoaderszLoader = createFixedModeLoader(state, reasonFrame);
/** Native element constructor permanently bound to the synthesizing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
