import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { scannerFrame } from '../core/modes';
export const state = 'scanning' as const;
export const LoaderszLoader = createFixedModeLoader(state, scannerFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
