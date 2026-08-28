import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { ganttFrame } from '../core/modes';
export const state = 'scheduling' as const;
export const LoaderszLoader = createFixedModeLoader(state, ganttFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
