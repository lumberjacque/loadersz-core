import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { eclipseFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'eclipsing' as const;
/** Imperative controller permanently bound to the eclipsing animation. */
export const LoaderszLoader = createFixedModeLoader(state, eclipseFrame);
/** Native element constructor permanently bound to the eclipsing animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
