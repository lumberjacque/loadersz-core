import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { illuminateFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'illuminating' as const;
export const LoaderszLoader = createFixedModeLoader(state, illuminateFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
