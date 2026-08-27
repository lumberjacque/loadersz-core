import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { nodegraphFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'graphing' as const;
export const LoaderszLoader = createFixedModeLoader(state, nodegraphFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
