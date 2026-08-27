import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { harmonyFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'harmonizing' as const;
export const LoaderszLoader = createFixedModeLoader(state, harmonyFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
