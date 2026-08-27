import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { indexFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'indexing' as const;
export const LoaderszLoader = createFixedModeLoader(state, indexFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
