import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { batchFrame } from '../core/modes';
export const state = 'batching' as const;
export const LoaderszLoader = createFixedModeLoader(state, batchFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
