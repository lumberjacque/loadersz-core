import type { OrbTheme } from './types';

/**
 * Resolves `auto` to the browser colour-scheme preference.
 *
 * @param theme Requested theme.
 * @returns A concrete `dark` or `light` renderer theme.
 */
export function resolveTheme(theme: OrbTheme): Exclude<OrbTheme, 'auto'> {
  if (theme !== 'auto') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** @returns Whether the browser currently requests reduced motion. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
