import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { heatmapFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'heatmapping' as const;
export const LoaderszLoader = createFixedModeLoader(state, heatmapFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
