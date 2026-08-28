import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { barChartFrame } from '../core/modes';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';

/** The fixed state registered by this entry point. */
export const state = 'bar-charting' as const;
/** Imperative controller permanently bound to the bar-charting animation. */
export const LoaderszLoader = createFixedModeLoader(state, barChartFrame);
/** Native element constructor permanently bound to the bar-charting animation. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
