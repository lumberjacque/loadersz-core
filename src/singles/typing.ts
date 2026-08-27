import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { ellipsisFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'typing' as const;
/** Imperative controller permanently bound to the typing animation. */
export const LoaderszLoader = createFixedModeLoader(state, ellipsisFrame);
/** Native element constructor permanently bound to the typing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
