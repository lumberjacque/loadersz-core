import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { uploadFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'uploading' as const;
/** Imperative controller permanently bound to the uploading animation. */
export const LoaderszLoader = createFixedModeLoader(state, uploadFrame);
/** Native element constructor permanently bound to the uploading animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
