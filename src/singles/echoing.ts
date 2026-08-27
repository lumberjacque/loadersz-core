import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { echoFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'echoing' as const;
/** Imperative controller permanently bound to the echoing animation. */
export const LoaderszLoader = createFixedModeLoader(state, echoFrame);
/** Native element constructor permanently bound to the echoing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
