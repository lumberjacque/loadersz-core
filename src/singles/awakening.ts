import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { novaFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'awakening' as const;
/** Imperative controller permanently bound to the awakening animation. */
export const LoaderszLoader = createFixedModeLoader(state, novaFrame);
/** Native element constructor permanently bound to the awakening animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
