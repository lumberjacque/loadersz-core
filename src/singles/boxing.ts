import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { boxPlotFrame } from '../core/modes';
export const state = 'boxing' as const;
export const LoaderszLoader = createFixedModeLoader(state, boxPlotFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
