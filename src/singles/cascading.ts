import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { cascadeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'cascading' as const;
/** Imperative controller permanently bound to the cascading animation. */
export const LoaderszLoader = createFixedModeLoader(state, cascadeFrame);
/** Native element constructor permanently bound to the cascading animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
