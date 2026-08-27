import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { condenseFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'condensing' as const;
/** Imperative controller permanently bound to the condensing animation. */
export const LoaderszLoader = createFixedModeLoader(state, condenseFrame);
/** Native element constructor permanently bound to the condensing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
