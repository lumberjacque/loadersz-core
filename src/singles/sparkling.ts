import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { sparkleFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'sparkling' as const;
export const LoaderszLoader = createFixedModeLoader(state, sparkleFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
