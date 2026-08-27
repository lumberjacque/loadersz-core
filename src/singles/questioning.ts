import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { queryFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'questioning' as const;
/** Imperative controller permanently bound to the questioning animation. */
export const LoaderszLoader = createFixedModeLoader(state, queryFrame);
/** Native element constructor permanently bound to the questioning animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
