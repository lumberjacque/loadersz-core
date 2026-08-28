import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { checkpointFrame } from '../core/modes';
export const state = 'checkpointing' as const;
export const LoaderszLoader = createFixedModeLoader(state, checkpointFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
