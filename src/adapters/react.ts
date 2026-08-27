import { createElement, forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import type {} from 'react/jsx-runtime';

import { registerLoadersz } from '../loadersz';
import type { LoaderszOrbOptions } from '../core/types';

registerLoadersz();

/** Props accepted by the React adapter and by `<loadersz-loader>` in React JSX. */
export interface LoaderszReactProps extends LoaderszOrbOptions, Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Native custom-element spelling for callers that prefer standard ARIA attributes. */
  'aria-label'?: string;
  /** Native custom-element spelling for callers that prefer HTML attributes. */
  'force-motion'?: boolean | '';
}

/**
 * Typed React wrapper around the native `<loadersz-loader>` element.
 *
 * @example
 * ```tsx
 * import { LoaderszLoader } from 'loadersz/react';
 *
 * <LoaderszLoader state="solving" size={160} speed={1.1} ariaLabel="Solving" />
 * ```
 */
export const LoaderszLoader = forwardRef<HTMLElement, LoaderszReactProps>(function LoaderszLoader(
  { forceMotion, ariaLabel, paused, particleRadius, ...props },
  ref,
) {
  return createElement('loadersz-loader', {
    ...props,
    ref,
    paused: paused ? '' : undefined,
    'particle-radius': particleRadius,
    'force-motion': forceMotion ? '' : undefined,
    'aria-label': ariaLabel ?? props['aria-label'],
  });
});

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'loadersz-loader': LoaderszReactProps;
    }
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'loadersz-loader': LoaderszReactProps;
    }
  }
}
