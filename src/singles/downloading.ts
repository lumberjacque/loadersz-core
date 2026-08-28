import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { downloadFrame } from '../core/modes';
export const state = 'downloading' as const;
export const LoaderszLoader = createFixedModeLoader(state, downloadFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
