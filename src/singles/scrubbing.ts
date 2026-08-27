import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { scrubberFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'scrubbing' as const;
export const LoaderszLoader = createFixedModeLoader(state, scrubberFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
