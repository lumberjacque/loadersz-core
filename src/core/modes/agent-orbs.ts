import { addDot, createFrame, createProjector, depth, fibonacciPoint } from './shared';
import type { FrameContext, OrbFrame } from './shared';

/**
 * Builds `settling`: a soft, monochrome orb gradually releases its remaining motion.
 *
 * The phase is continuous and intentionally never switches state, so a looping loader has no
 * perceptible reset or sudden accent burst.
 */
export function settleFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const calm = (Math.sin(context.time * 0.72) + 1) / 2;
  const project = createProjector(context, 0.16 + (1 - calm) * 0.22, 0.44, 0.82 + calm * 0.08);
  const count = Math.round(56 * context.density);

  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const residual = Math.sin(index * 2.4 + context.time * 0.76) * (0.04 + (1 - calm) * 0.09);
    const point = project(x * (0.9 + residual), y * (0.9 + residual), z * (0.9 + residual));
    addDot(frame, point, 0.3 + depth(point) * 0.78, 0.12 + depth(point) * 0.42 + calm * 0.08);
  }

  const center = project(0, 0, 0.7);
  addDot(frame, center, 0.92 + calm * 0.5, 0.38 + calm * 0.32);
  return frame;
}
