import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { reconnectFrame } from '../core/modes';
export const state = 'reconnecting' as const;
export const LoaderszLoader = createFixedModeLoader(state, reconnectFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
