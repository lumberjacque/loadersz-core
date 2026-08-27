import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { satellitesFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'orbiting' as const;
/** Imperative controller permanently bound to the orbiting animation. */
export const LoaderszLoader = createFixedModeLoader(state, satellitesFrame);
/** Native element constructor permanently bound to the orbiting animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
