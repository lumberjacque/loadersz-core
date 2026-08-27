import { describe, expect, it } from 'vitest';
import { FRAME_BUILDERS, buildFrame } from './modes';

const frameContext = { time: 1.25, radius: 40, density: 1 };

describe('orb modes', () => {
  it.each(Object.keys(FRAME_BUILDERS))('%s produces visible geometry', (mode) => {
    const frame = buildFrame(mode as keyof typeof FRAME_BUILDERS, frameContext);
    expect(frame.dots.length + frame.lines.length).toBeGreaterThan(0);
    expect(frame.dots.every((dot) => Number.isFinite(dot.x) && Number.isFinite(dot.y) && Number.isFinite(dot.z))).toBe(
      true,
    );
  });

  it('is deterministic for a fixed point in time', () => {
    expect(buildFrame('network', frameContext)).toEqual(buildFrame('network', frameContext));
  });
});
