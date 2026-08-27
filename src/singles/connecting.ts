import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { networkFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'connecting' as const;
/** Imperative controller permanently bound to the connecting animation. */
export const LoaderszLoader = createFixedModeLoader(state, networkFrame);
/** Native element constructor permanently bound to the connecting animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
