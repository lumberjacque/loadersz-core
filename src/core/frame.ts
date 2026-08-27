import type { OrbFrame, ProjectedPoint } from './types';

/**
 * Creates an empty drawable geometry frame.
 *
 * @returns A fresh mutable frame with no dots or lines.
 */
export function createFrame(): OrbFrame {
  return { dots: [], lines: [] };
}

/**
 * Adds a visible particle to a frame, discarding near-transparent particles early.
 *
 * @param frame Destination geometry.
 * @param point Projected particle position and depth.
 * @param radius Particle radius in canvas pixels.
 * @param alpha Opacity; values at or below `0.015` are ignored.
 * @param tone Optional HSL hue for colourful modes.
 */
export function addDot(frame: OrbFrame, point: ProjectedPoint, radius: number, alpha = 1, tone?: number): void {
  if (alpha > 0.015) frame.dots.push({ ...point, radius, alpha, tone });
}

/**
 * Adds a visible line segment to a frame, discarding near-transparent lines early.
 *
 * @param frame Destination geometry.
 * @param from Line start.
 * @param to Line end.
 * @param alpha Opacity; values at or below `0.015` are ignored.
 * @param width Stroke width in canvas pixels.
 * @param tone Optional HSL hue.
 */
export function addLine(
  frame: OrbFrame,
  from: ProjectedPoint,
  to: ProjectedPoint,
  alpha: number,
  width: number,
  tone?: number,
): void {
  if (alpha > 0.015) frame.lines.push({ from, to, alpha, width, tone });
}

/**
 * Converts projected depth from `-1`–`1` to a normalized `0`–`1` value.
 *
 * @param point Projected point whose depth to normalize.
 * @returns Depth normalized from `z` in `[-1, 1]` to `[0, 1]`.
 */
export function depth(point: ProjectedPoint): number {
  return (point.z + 1) / 2;
}
