import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { telemetryFrame } from '../core/modes';
export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'telemetry' as const;
export const LoaderszLoader = createFixedModeLoader(state, telemetryFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
