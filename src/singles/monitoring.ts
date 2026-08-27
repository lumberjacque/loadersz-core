import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { waveformFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'monitoring' as const;
/** Imperative controller bound to the live waveform. */
export const LoaderszLoader = createFixedModeLoader(state, waveformFrame);
/** Native element constructor bound to the live waveform. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
