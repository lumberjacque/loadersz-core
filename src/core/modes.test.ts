import { describe, expect, it } from 'vitest';
import { FRAME_BUILDERS, buildFrame } from './modes';

const frameContext = { time: 1.25, radius: 40, density: 1 };

describe('orb modes', () => {
  it.each(Object.keys(FRAME_BUILDERS))('%s produces visible geometry', (mode) => {
    const frame = buildFrame(mode as keyof typeof FRAME_BUILDERS, frameContext);
    expect(frame.dots.length + frame.lines.length + frame.rects.length + frame.arcs.length).toBeGreaterThan(0);
    expect(frame.dots.every((dot) => Number.isFinite(dot.x) && Number.isFinite(dot.y) && Number.isFinite(dot.z))).toBe(
      true,
    );
    expect(
      frame.rects.every((rect) => Number.isFinite(rect.x) && Number.isFinite(rect.y) && Number.isFinite(rect.z)),
    ).toBe(true);
    expect(frame.arcs.every((arc) => Number.isFinite(arc.x) && Number.isFinite(arc.y) && Number.isFinite(arc.z))).toBe(
      true,
    );
  });

  it('is deterministic for a fixed point in time', () => {
    expect(buildFrame('network', frameContext)).toEqual(buildFrame('network', frameContext));
  });

  it('adds treemap partitions as density increases', () => {
    const sparse = buildFrame('treemap', { ...frameContext, density: 0.5 });
    const detailed = buildFrame('treemap', { ...frameContext, density: 2 });

    expect(sparse.rects).toHaveLength(4);
    expect(detailed.rects).toHaveLength(12);
    expect(new Set(detailed.rects.map((rect) => rect.paletteRole))).toEqual(
      new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    );
  });

  it('marks only the active cube turn as palette-addressable', () => {
    const cube = buildFrame('cube', { ...frameContext, time: 1.25 });

    expect(cube.dots.some((dot) => dot.paletteRole === 1)).toBe(true);
    expect(cube.dots.some((dot) => dot.paletteRole === null)).toBe(true);
  });
});
