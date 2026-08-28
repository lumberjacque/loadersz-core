import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { pendulumFrame } from '../core/modes';
export const state = 'pendulating' as const;
export const LoaderszLoader = createFixedModeLoader(state, pendulumFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
