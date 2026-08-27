import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { circuitboardFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'wiring' as const;
/** Imperative controller bound to the circuit routing loader. */
export const LoaderszLoader = createFixedModeLoader(state, circuitboardFrame);
/** Native element constructor bound to the circuit routing loader. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
