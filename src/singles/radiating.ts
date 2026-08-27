import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { radianceFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'radiating' as const;
export const LoaderszLoader = createFixedModeLoader(state, radianceFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
