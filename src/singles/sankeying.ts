import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { sankeyFrame } from '../core/modes';
export const state = 'sankeying' as const;
export const LoaderszLoader = createFixedModeLoader(state, sankeyFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
