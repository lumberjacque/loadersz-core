import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { marqueeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'marqueeing' as const;
/** Imperative controller bound to the chasing perimeter. */
export const LoaderszLoader = createFixedModeLoader(state, marqueeFrame);
/** Native element constructor bound to the chasing perimeter. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
