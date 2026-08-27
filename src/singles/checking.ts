import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { gridFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'checking' as const;
/** Imperative controller bound to the verification grid. */
export const LoaderszLoader = createFixedModeLoader(state, gridFrame);
/** Native element constructor bound to the verification grid. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
