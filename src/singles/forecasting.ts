import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { forecastFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'forecasting' as const;
/** Imperative controller bound to observed and projected data. */
export const LoaderszLoader = createFixedModeLoader(state, forecastFrame);
/** Native element constructor bound to observed and projected data. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
