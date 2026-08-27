import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { memoryFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'recalling' as const;
/** Imperative controller permanently bound to the recalling animation. */
export const LoaderszLoader = createFixedModeLoader(state, memoryFrame);
/** Native element constructor permanently bound to the recalling animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
