import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { priorityFrame } from '../core/modes';
export const state = 'prioritizing' as const;
export const LoaderszLoader = createFixedModeLoader(state, priorityFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
