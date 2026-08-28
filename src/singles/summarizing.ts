import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { donutFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'summarizing' as const;
/** Imperative controller permanently bound to the summarizing animation. */
export const LoaderszLoader = createFixedModeLoader(state, donutFrame);
/** Native element constructor permanently bound to the summarizing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
