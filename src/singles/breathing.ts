import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { pulseFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'breathing' as const;
/** Imperative controller permanently bound to the breathing animation. */
export const LoaderszLoader = createFixedModeLoader(state, pulseFrame);
/** Native element constructor permanently bound to the breathing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
