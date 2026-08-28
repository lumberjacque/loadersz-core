import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { dispatchFrame } from '../core/modes';
export const state = 'dispatching' as const;
export const LoaderszLoader = createFixedModeLoader(state, dispatchFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
