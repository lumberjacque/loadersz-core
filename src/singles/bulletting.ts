import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { bulletFrame } from '../core/modes';
export const state = 'bulletting' as const;
export const LoaderszLoader = createFixedModeLoader(state, bulletFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
