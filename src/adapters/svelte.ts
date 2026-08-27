import { registerLoadersz } from '../loadersz';
import type { HTMLAttributes } from 'svelte/elements';

import type { LoaderszOrbOptions } from '../core/types';

registerLoadersz();

/** Attributes accepted by `<loadersz-loader>` in a Svelte template. */
export type LoaderszSvelteAttributes = HTMLAttributes<HTMLElement> &
  LoaderszOrbOptions & {
    'aria-label'?: string;
    'force-motion'?: boolean | '';
    'particle-radius'?: number;
  };

declare module 'svelte/elements' {
  interface SvelteHTMLElements {
    'loadersz-loader': LoaderszSvelteAttributes;
  }
}
