import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { mirrorFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'reflecting' as const;
/** Imperative controller permanently bound to the reflecting animation. */
export const LoaderszLoader = createFixedModeLoader(state, mirrorFrame);
/** Native element constructor permanently bound to the reflecting animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
