import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { retryFrame } from '../core/modes';
export const state = 'retrying' as const;
export const LoaderszLoader = createFixedModeLoader(state, retryFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
