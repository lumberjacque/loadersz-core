import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { flickerFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'flickering' as const;
export const LoaderszLoader = createFixedModeLoader(state, flickerFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
