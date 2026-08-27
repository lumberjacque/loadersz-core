import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { correlationFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'correlating' as const;
export const LoaderszLoader = createFixedModeLoader(state, correlationFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
