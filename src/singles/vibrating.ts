import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { vibrateFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'vibrating' as const;
export const LoaderszLoader = createFixedModeLoader(state, vibrateFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
