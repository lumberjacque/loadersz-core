import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { driftFrame } from '../core/modes';
export const state = 'drifting' as const;
export const LoaderszLoader = createFixedModeLoader(state, driftFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
