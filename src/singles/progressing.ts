import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { progressFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'progressing' as const;
/** Imperative controller bound to the travelling progress ring. */
export const LoaderszLoader = createFixedModeLoader(state, progressFrame);
/** Native element constructor bound to the travelling progress ring. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
