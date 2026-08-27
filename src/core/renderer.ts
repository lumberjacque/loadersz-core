import type { OrbFrame, OrbTheme, ProjectedPoint } from './types';

/** Resolves one point or line to a depth-aware CSS colour string. */
function shade(
  theme: Exclude<OrbTheme, 'auto'>,
  point: ProjectedPoint,
  alpha: number,
  tone: number | undefined,
  hueOverride: number,
  colorOverride: string | undefined,
): string {
  if (colorOverride) return colorOverride;
  const depth = (point.z + 1) / 2;
  const brightness = 0.22 + depth * 0.68;
  const resolvedTone = hueOverride >= 0 ? hueOverride : tone;
  if (resolvedTone !== undefined) {
    const lightness = theme === 'dark' ? 42 + brightness * 32 : 30 + brightness * 16;
    return `hsl(${resolvedTone} 86% ${lightness}% / ${alpha})`;
  }
  const channel = Math.round((theme === 'dark' ? brightness : 1 - brightness) * 255);
  return `rgba(${channel}, ${channel}, ${channel}, ${alpha})`;
}

/**
 * Paints frame lines and depth-sorted dots onto a Canvas 2D context.
 *
 * @param context Target Canvas 2D context.
 * @param frame Geometry produced by a frame builder.
 * @param theme Concrete theme; resolve `auto` before calling.
 * @param hueOverride Hue in `0`–`360`, or `-1` to keep each mode's native tones.
 * @param particleRadius Multiplier for particle radii, clamped by the caller to `0.5`–`2.5`.
 * @returns Nothing. The caller is responsible for clearing the canvas first.
 */
export function paintFrame(
  context: CanvasRenderingContext2D,
  frame: OrbFrame,
  theme: Exclude<OrbTheme, 'auto'>,
  hueOverride = -1,
  colorOverride?: string,
  particleRadius = 1,
): void {
  const usesColorOverride = Boolean(colorOverride);
  context.save();
  for (const line of frame.lines) {
    const midpoint = { x: 0, y: 0, z: (line.from.z + line.to.z) / 2 };
    context.globalAlpha = usesColorOverride ? line.alpha : 1;
    context.strokeStyle = shade(theme, midpoint, line.alpha, line.tone, hueOverride, colorOverride);
    context.lineWidth = line.width;
    context.beginPath();
    context.moveTo(line.from.x, line.from.y);
    context.lineTo(line.to.x, line.to.y);
    context.stroke();
  }
  [...frame.dots]
    .sort((left, right) => left.z - right.z)
    .forEach((dot) => {
      context.globalAlpha = usesColorOverride ? dot.alpha : 1;
      context.fillStyle = shade(theme, dot, dot.alpha, dot.tone, hueOverride, colorOverride);
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius * particleRadius, 0, Math.PI * 2);
      context.fill();
    });
  context.restore();
}
