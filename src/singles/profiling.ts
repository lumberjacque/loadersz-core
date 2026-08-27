import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { profileFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'profiling' as const;
export const LoaderszLoader = createFixedModeLoader(state, profileFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
