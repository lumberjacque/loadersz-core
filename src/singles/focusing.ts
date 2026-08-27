import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { apertureFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'focusing' as const;
/** Imperative controller permanently bound to the focusing animation. */
export const LoaderszLoader = createFixedModeLoader(state, apertureFrame);
/** Native element constructor permanently bound to the focusing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
