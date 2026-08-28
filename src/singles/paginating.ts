import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { paginationFrame } from '../core/modes';
export const state = 'paginating' as const;
export const LoaderszLoader = createFixedModeLoader(state, paginationFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
