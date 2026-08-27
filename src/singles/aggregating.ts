import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { aggregateFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'aggregating' as const;
export const LoaderszLoader = createFixedModeLoader(state, aggregateFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
