import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { twinkleFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'twinkling' as const;
export const LoaderszLoader = createFixedModeLoader(state, twinkleFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
