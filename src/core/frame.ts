import type { OrbFrame, ProjectedPoint } from './types';

/**
 * Creates an empty drawable geometry frame.
 *
 * @returns A fresh mutable frame with no dots or lines.
 */
export function createFrame(): OrbFrame {
  return { dots: [], lines: [], rects: [], arcs: [], polygons: [] };
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
 * Adds a filled rectangular mark to a frame.
 *
 * @param frame Destination geometry.
 * @param rect Rectangle position, dimensions and depth.
 * @param alpha Opacity; values at or below `0.015` are ignored.
 * @param tone Optional HSL hue.
 */
export function addRect(
  frame: OrbFrame,
  rect: { x: number; y: number; width: number; height: number; z?: number },
  alpha = 1,
  tone?: number,
): void {
  if (alpha > 0.015 && rect.width > 0 && rect.height > 0) {
    frame.rects.push({ ...rect, z: rect.z ?? 0, alpha, tone });
  }
}

/**
 * Adds a stroked circular arc to a frame.
 *
 * @param frame Destination geometry.
 * @param arc Arc centre, radius, angles, width and depth.
 * @param alpha Opacity; values at or below `0.015` are ignored.
 * @param tone Optional HSL hue.
 */
export function addArc(
  frame: OrbFrame,
  arc: {
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    width: number;
    z?: number;
    cap?: 'round' | 'butt';
  },
  alpha = 1,
  tone?: number,
): void {
  if (alpha > 0.015 && arc.radius > 0 && arc.width > 0) {
    frame.arcs.push({ ...arc, z: arc.z ?? 0, alpha, tone });
  }
}

/**
 * Adds a filled polygon using ordered projected vertices.
 *
 * @param frame Destination geometry.
 * @param points At least three vertices ordered around the perimeter.
 * @param alpha Opacity; values at or below `0.015` are ignored.
 * @param tone Optional HSL hue.
 */
export function addPolygon(frame: OrbFrame, points: readonly ProjectedPoint[], alpha = 1, tone?: number): void {
  if (alpha <= 0.015 || points.length < 3) return;
  const x = points.reduce((total, point) => total + point.x, 0) / points.length;
  const y = points.reduce((total, point) => total + point.y, 0) / points.length;
  const z = points.reduce((total, point) => total + point.z, 0) / points.length;
  frame.polygons.push({ x, y, z, points, alpha, tone });
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
