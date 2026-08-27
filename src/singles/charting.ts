import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { chartFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'charting' as const;
/** Imperative controller bound to a live bar chart. */
export const LoaderszLoader = createFixedModeLoader(state, chartFrame);
/** Native element constructor bound to the live bar chart. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
