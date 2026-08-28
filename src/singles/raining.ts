import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { rainFrame } from '../core/modes';
export const state = 'raining' as const;
export const LoaderszLoader = createFixedModeLoader(state, rainFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
