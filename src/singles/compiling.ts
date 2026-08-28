import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { compileFrame } from '../core/modes';
export const state = 'compiling' as const;
export const LoaderszLoader = createFixedModeLoader(state, compileFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
