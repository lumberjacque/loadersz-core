import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { calendarFrame } from '../core/modes';
export const state = 'calendarizing' as const;
export const LoaderszLoader = createFixedModeLoader(state, calendarFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
