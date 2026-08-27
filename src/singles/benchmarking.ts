import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { benchmarkFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'benchmarking' as const;
export const LoaderszLoader = createFixedModeLoader(state, benchmarkFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
