import type { OrbFrame, OrbTheme, ProjectedPoint } from './types';

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const corner = Math.min(radius, width / 2, height / 2);
  if (corner <= 0.1) {
    context.fillRect(x, y, width, height);
    return;
  }
  context.beginPath();
  context.moveTo(x + corner, y);
  context.lineTo(x + width - corner, y);
  context.quadraticCurveTo(x + width, y, x + width, y + corner);
  context.lineTo(x + width, y + height - corner);
  context.quadraticCurveTo(x + width, y + height, x + width - corner, y + height);
  context.lineTo(x + corner, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - corner);
  context.lineTo(x, y + corner);
  context.quadraticCurveTo(x, y, x + corner, y);
  context.fill();
}

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
 * Paints frame rectangles, arcs, lines and depth-sorted dots onto a Canvas 2D context.
 *
 * @param context Target Canvas 2D context.
 * @param frame Geometry produced by a frame builder.
 * @param theme Concrete theme; resolve `auto` before calling.
 * @param hueOverride Hue in `0`–`360`, or `-1` to keep each mode's native tones.
 * @param particleRadius Multiplier for particle/arc widths and rectangle corner rounding, clamped by the caller to `0.5`–`2.5`.
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
  [...frame.rects]
    .sort((left, right) => left.z - right.z)
    .forEach((rect) => {
      context.globalAlpha = usesColorOverride ? rect.alpha : 1;
      context.fillStyle = shade(theme, rect, rect.alpha, rect.tone, hueOverride, colorOverride);
      fillRoundedRect(context, rect.x, rect.y, rect.width, rect.height, particleRadius * 1.65);
    });
  for (const arc of frame.arcs) {
    context.globalAlpha = usesColorOverride ? arc.alpha : 1;
    context.strokeStyle = shade(theme, arc, arc.alpha, arc.tone, hueOverride, colorOverride);
    context.lineWidth = arc.width * particleRadius;
    context.lineCap = 'round';
    context.beginPath();
    context.arc(arc.x, arc.y, arc.radius, arc.startAngle, arc.endAngle);
    context.stroke();
  }
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
