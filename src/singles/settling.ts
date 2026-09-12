import { createFixedModeElement, createFixedModeLoader } from '../core/FixedLoader';
import { settleFrame } from '../core/modes/agent-orbs';

export type { LoaderszSingleModeOptions } from '../core/FixedLoader';
export const state = 'settling' as const;
export const LoaderszLoader = createFixedModeLoader(state, settleFrame);
export const LoaderszLoaderElement = createFixedModeElement(LoaderszLoader);
if (!customElements.get('loadersz-loader')) customElements.define('loadersz-loader', LoaderszLoaderElement);
