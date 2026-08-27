import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { shimmerFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'shimmering' as const;
export const LoaderszLoader = createFixedModeLoader(state, shimmerFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
