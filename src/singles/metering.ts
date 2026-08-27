import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { meterFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'metering' as const;
/** Imperative controller bound to a live segmented dial. */
export const LoaderszLoader = createFixedModeLoader(state, meterFrame);
/** Native element constructor bound to the live segmented dial. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
