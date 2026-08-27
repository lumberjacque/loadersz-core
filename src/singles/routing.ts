import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { flowmapFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'routing' as const;
export const LoaderszLoader = createFixedModeLoader(state, flowmapFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
