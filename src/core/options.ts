import { STATE_TO_MODE } from './state-registry';
import type { LoaderszOrbOptions, OrbMode, OrbState } from './types';

export { STATE_TO_MODE } from './state-registry';

/** Fully populated default options used whenever a caller omits a field. */
export const DEFAULT_OPTIONS: Required<LoaderszOrbOptions> = {
  state: 'working',
  size: 96,
  speed: 1,
  theme: 'auto',
  paused: false,
  forceMotion: false,
  ariaLabel: 'Loading',
  density: 1,
  particleRadius: 1,
  hue: -1,
  color: '',
  palette: [],
};

/** Maximum number of caller-provided colours retained by the palette interface. */
export const MAX_PALETTE_COLORS = 8;

/**
 * Creates a safe, compact palette value without validating browser-specific CSS syntax.
 *
 * CSS validation happens against the owning canvas because custom properties must resolve in
 * that element's cascade.
 *
 * @param palette Caller-provided ordered CSS colours.
 * @returns Trimmed non-empty colours, limited to {@link MAX_PALETTE_COLORS} entries.
 */
export function normalizePalette(palette: readonly string[] | undefined): string[] {
  if (!palette) return [];
  return palette
    .filter((color): color is string => typeof color === 'string')
    .map((color) => color.trim())
    .filter(Boolean)
    .slice(0, MAX_PALETTE_COLORS);
}

/**
 * Resolves a state name to a geometry builder name.
 *
 * @param state Semantic state or direct geometry mode.
 * @returns The mode that can be used as a key in `FRAME_BUILDERS`.
 */
export function resolveMode(state: OrbState): OrbMode {
  return STATE_TO_MODE[state as keyof typeof STATE_TO_MODE] ?? (state as OrbMode);
}

/**
 * Adds defaults to a partial option object without mutating the caller's value.
 *
 * @param options Caller-provided option values.
 * @returns A complete option object with every field present.
 */
export function mergeOptions(options: LoaderszOrbOptions): Required<LoaderszOrbOptions> {
  return { ...DEFAULT_OPTIONS, ...options, palette: normalizePalette(options.palette) };
}
