import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { pollingFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'polling' as const;
export const LoaderszLoader = createFixedModeLoader(state, pollingFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
