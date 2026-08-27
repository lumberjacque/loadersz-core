import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { glimmerFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'glimmering' as const;
export const LoaderszLoader = createFixedModeLoader(state, glimmerFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
