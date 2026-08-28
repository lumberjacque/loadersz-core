import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { verifyFrame } from '../core/modes';
export const state = 'verifying' as const;
export const LoaderszLoader = createFixedModeLoader(state, verifyFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
