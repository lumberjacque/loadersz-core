import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { associateFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'associating' as const;
/** Imperative controller permanently bound to the associating animation. */
export const LoaderszLoader = createFixedModeLoader(state, associateFrame);
/** Native element constructor permanently bound to the associating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
