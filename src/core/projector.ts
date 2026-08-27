import type { ProjectedPoint } from './types';

/**
 * Rotates a normalized 3D point around yaw and pitch axes, then maps it to canvas coordinates.
 *
 * @param x Unit-space horizontal coordinate.
 * @param y Unit-space vertical coordinate.
 * @param z Unit-space depth coordinate.
 * @param yaw Horizontal rotation in radians.
 * @param pitch Vertical rotation in radians.
 * @param radius Canvas scale in pixels.
 * @param center Canvas center coordinate in pixels.
 * @returns Projected point with its post-rotation depth retained in `z`.
 */
export function projectPoint(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  radius: number,
  center: number,
): ProjectedPoint {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const x1 = x * cosYaw - z * sinYaw;
  const z1 = x * sinYaw + z * cosYaw;
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  return {
    x: center + x1 * radius,
    y: center - (y * cosPitch - z1 * sinPitch) * radius,
    z: y * sinPitch + z1 * cosPitch,
  };
}
