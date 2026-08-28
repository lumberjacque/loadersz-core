import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { radarPlotFrame } from '../core/modes';
export const state = 'radaring' as const;
export const LoaderszLoader = createFixedModeLoader(state, radarPlotFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
