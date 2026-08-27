import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { streamFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'streaming' as const;
/** Imperative controller bound to flowing packet lanes. */
export const LoaderszLoader = createFixedModeLoader(state, streamFrame);
/** Native element constructor bound to flowing packet lanes. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
