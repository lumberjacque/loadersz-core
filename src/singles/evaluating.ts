import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { evaluateFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'evaluating' as const;
/** Imperative controller permanently bound to the evaluating animation. */
export const LoaderszLoader = createFixedModeLoader(state, evaluateFrame);
/** Native element constructor permanently bound to the evaluating animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
