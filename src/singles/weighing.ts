import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { scalesFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'weighing' as const;
/** Imperative controller permanently bound to the weighing animation. */
export const LoaderszLoader = createFixedModeLoader(state, scalesFrame);
/** Native element constructor permanently bound to the weighing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
