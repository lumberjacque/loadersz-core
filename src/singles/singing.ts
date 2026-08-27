import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { auroraFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'singing' as const;
/** Imperative controller permanently bound to the singing animation. */
export const LoaderszLoader = createFixedModeLoader(state, auroraFrame);
/** Native element constructor permanently bound to the singing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
