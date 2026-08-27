import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { queueFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'queuing' as const;
/** Imperative controller permanently bound to the queuing animation. */
export const LoaderszLoader = createFixedModeLoader(state, queueFrame);
/** Native element constructor permanently bound to the queuing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
