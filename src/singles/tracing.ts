import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { traceFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'tracing' as const;
/** Imperative controller permanently bound to the tracing animation. */
export const LoaderszLoader = createFixedModeLoader(state, traceFrame);
/** Native element constructor permanently bound to the tracing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
