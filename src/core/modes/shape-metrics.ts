import type { FrameContext } from './shared';

/** Describes a bounded density-derived count for a repeatable visual structure. */
export interface CountRule {
  readonly base: number;
  readonly minimum: number;
  readonly maximum: number;
}

/** Resolves a bounded count so density adds detail without making a frame unreasonably expensive. */
export function densityCount(context: FrameContext, rule: CountRule): number {
  return Math.max(rule.minimum, Math.min(rule.maximum, Math.round(rule.base * context.density)));
}

/** Resolves thickness while reserving a caller-defined gap to prevent adjacent marks from colliding. */
export function safeThickness(context: FrameContext, base: number, available: number, gap: number): number {
  const multiplier = context.particleRadius ?? 1;
  return Math.max(0.4, Math.min(base * multiplier, Math.max(0.4, available - gap)));
}

/** Creates a stable segment gap from available circumference/width and requested density. */
export function safeGap(available: number, count: number, preferred = 2): number {
  return Math.min(preferred, Math.max(0.6, (available / Math.max(1, count)) * 0.32));
}
