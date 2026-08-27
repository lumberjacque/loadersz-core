import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { synchronizeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'synchronizing' as const;
/** Imperative controller permanently bound to the synchronizing animation. */
export const LoaderszLoader = createFixedModeLoader(state, synchronizeFrame);
/** Native element constructor permanently bound to the synchronizing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
