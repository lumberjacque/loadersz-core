import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { clustersFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'clustering' as const;
export const LoaderszLoader = createFixedModeLoader(state, clustersFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
