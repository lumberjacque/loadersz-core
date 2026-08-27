import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { waterfallFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'waterfalling' as const;
export const LoaderszLoader = createFixedModeLoader(state, waterfallFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
