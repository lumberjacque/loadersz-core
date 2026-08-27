import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { beatsFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'throbbing' as const;
/** Imperative controller permanently bound to the throbbing animation. */
export const LoaderszLoader = createFixedModeLoader(state, beatsFrame);
/** Native element constructor permanently bound to the throbbing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
