import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { hourglassFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'waiting' as const;
/** Imperative controller bound to the animated hourglass. */
export const LoaderszLoader = createFixedModeLoader(state, hourglassFrame);
/** Native element constructor bound to the animated hourglass. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
