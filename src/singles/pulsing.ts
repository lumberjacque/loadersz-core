import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { ringsFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'pulsing' as const;
/** Imperative controller bound to expanding pulse rings. */
export const LoaderszLoader = createFixedModeLoader(state, ringsFrame);
/** Native element constructor bound to expanding pulse rings. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
