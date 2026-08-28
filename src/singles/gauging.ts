import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { gaugeFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'gauging' as const;
/** Imperative controller permanently bound to the gauging animation. */
export const LoaderszLoader = createFixedModeLoader(state, gaugeFrame);
/** Native element constructor permanently bound to the gauging animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
