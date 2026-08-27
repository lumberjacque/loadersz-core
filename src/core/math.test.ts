import { describe, expect, it } from 'vitest';
import { clamp, fibonacciPoint, normalize, smoothstep } from './math';

describe('math helpers', () => {
  it('clamps a value into its requested range', () => {
    expect(clamp(-3, 0, 2)).toBe(0);
    expect(clamp(1, 0, 2)).toBe(1);
    expect(clamp(9, 0, 2)).toBe(2);
  });

  it('keeps normalised vectors on the unit sphere', () => {
    const point = normalize([3, 4, 0]);
    expect(Math.hypot(...point)).toBeCloseTo(1);
  });

  it('creates stable points on a unit sphere', () => {
    const point = fibonacciPoint(5, 32);
    expect(Math.hypot(...point)).toBeCloseTo(1);
    expect(point).toEqual(fibonacciPoint(5, 32));
  });

  it('eases smoothly from zero to one', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBe(0.5);
  });
});
