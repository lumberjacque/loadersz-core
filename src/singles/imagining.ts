import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { imagineFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'imagining' as const;
/** Imperative controller permanently bound to the imagining animation. */
export const LoaderszLoader = createFixedModeLoader(state, imagineFrame);
/** Native element constructor permanently bound to the imagining animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
