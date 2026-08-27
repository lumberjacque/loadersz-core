import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { candlesFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'candlesticking' as const;
export const LoaderszLoader = createFixedModeLoader(state, candlesFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
