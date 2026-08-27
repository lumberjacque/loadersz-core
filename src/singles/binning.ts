import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { histogramFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'binning' as const;
export const LoaderszLoader = createFixedModeLoader(state, histogramFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
