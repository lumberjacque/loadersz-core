import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { surfaceFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'surfacing' as const;
export const LoaderszLoader = createFixedModeLoader(state, surfaceFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
