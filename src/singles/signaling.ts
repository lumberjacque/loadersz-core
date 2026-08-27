import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { signalFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'signaling' as const;
/** Imperative controller bound to broadcast signal waves. */
export const LoaderszLoader = createFixedModeLoader(state, signalFrame);
/** Native element constructor bound to broadcast signal waves. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
