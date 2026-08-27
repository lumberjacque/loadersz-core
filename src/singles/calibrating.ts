import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { gyroscopeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'calibrating' as const;
/** Imperative controller permanently bound to the calibrating animation. */
export const LoaderszLoader = createFixedModeLoader(state, gyroscopeFrame);
/** Native element constructor permanently bound to the calibrating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
