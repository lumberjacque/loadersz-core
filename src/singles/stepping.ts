import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { stepsFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'stepping' as const;
/** Imperative controller bound to the staged task loader. */
export const LoaderszLoader = createFixedModeLoader(state, stepsFrame);
/** Native element constructor bound to the staged task loader. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
