import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { pinwheelFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'spinning' as const;
/** Imperative controller permanently bound to the spinning animation. */
export const LoaderszLoader = createFixedModeLoader(state, pinwheelFrame);
/** Native element constructor permanently bound to the spinning animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
