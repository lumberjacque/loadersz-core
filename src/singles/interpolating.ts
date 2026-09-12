import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { interpolateFrame } from '../core/modes/image-processing';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
/** Fixed state registered by this entry point. */
export const state = 'interpolating' as const;
/** Imperative controller bound to a dotted chart interpolation. */
export const LoaderszLoader = createFixedModeLoader(state, interpolateFrame);
/** Native element constructor bound to a dotted chart interpolation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
