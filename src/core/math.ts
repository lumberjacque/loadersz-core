import type { Vector3 } from './types';

/** Full circle in radians, shared by periodic geometry builders. */
export const TAU = Math.PI * 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Restricts a number to an inclusive range.
 *
 * @param value Candidate number.
 * @param min Inclusive lower bound.
 * @param max Inclusive upper bound.
 * @returns `value` restricted to the supplied range.
 */
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
/**
 * Interpolates linearly between two values.
 *
 * @param start Value at `amount = 0`.
 * @param end Value at `amount = 1`.
 * @param amount Interpolation amount; values outside `0`–`1` extrapolate.
 * @returns Linear interpolation between the two values.
 */
export const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;
/**
 * Applies a cubic smooth-step easing curve to a normalized value.
 *
 * @param value Progress normally in the `0`–`1` range.
 * @returns Cubic ease-in-out progress with zero velocity at both ends.
 */
export const smoothstep = (value: number) => value * value * (3 - 2 * value);

/**
 * Produces a deterministic pseudo-random value without retaining state.
 *
 * @param seed Any finite number used to identify a particle or line.
 * @returns A stable number in the half-open range `[0, 1)`.
 */
export function hash(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Places one point on an approximately uniform unit sphere using a Fibonacci distribution.
 *
 * @param index Zero-based point index.
 * @param count Total number of points in the distribution.
 * @returns A unit-length `[x, y, z]` vector.
 */
export function fibonacciPoint(index: number, count: number): Vector3 {
  const y = 1 - (2 * (index + 0.5)) / count;
  const radius = Math.sqrt(1 - y * y);
  const angle = index * GOLDEN_ANGLE;
  return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
}

/**
 * Normalizes a 3D vector safely.
 *
 * @param vector Three-dimensional vector to normalize.
 * @returns A unit vector, or `[0, 0, 0]` when the input has zero length.
 */
export function normalize([x, y, z]: Vector3): Vector3 {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
}
