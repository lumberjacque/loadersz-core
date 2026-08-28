import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { bubbleChartFrame } from '../core/modes';

/** Fixed state registered by this entry point. */
export const state = 'bubble-charting' as const;
/** Imperative controller permanently bound to the packed bubble chart. */
export const LoaderszLoader = createFixedModeLoader(state, bubbleChartFrame);
/** Native element constructor permanently bound to the packed bubble chart. */
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);

if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
