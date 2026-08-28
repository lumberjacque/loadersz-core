import { addArc, addDot, addLine, addRect, createFrame, depth } from '../frame';
import { fibonacciPoint, hash, lerp, normalize, smoothstep, TAU } from '../math';
import { projectPoint } from '../projector';
import type { FrameContext, OrbFrame, OrbMode, ProjectedPoint, Vector3 } from '../types';

export type Project = (x: number, y: number, z: number) => ProjectedPoint;

/** Creates a context-bound 3D-to-canvas projection function. */
export function createProjector(context: FrameContext, yaw: number, pitch: number, scale = 1): Project {
  const center = context.radius / 0.82;
  return (x, y, z) => projectPoint(x, y, z, yaw, pitch, context.radius * scale, center);
}

/** Populates a frame with an evenly distributed, projected particle sphere. */
export function sphereDots(
  context: FrameContext,
  project: Project,
  radius = 1,
  callback?: (point: ProjectedPoint, index: number) => void,
): OrbFrame {
  const frame = createFrame();
  const count = Math.round(170 * context.density);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const point = project(x * radius, y * radius, z * radius);
    addDot(frame, point, 0.45 + depth(point) * 1.4, 0.15 + depth(point) * 0.58);
    callback?.(point, index);
  }
  return frame;
}

export { addArc, addDot, addLine, addRect, createFrame, depth, fibonacciPoint, hash, lerp, normalize, smoothstep, TAU };
export type { FrameContext, OrbFrame, OrbMode, ProjectedPoint, Vector3 };
