import { describe, expect, it } from 'vitest';
import { paintFrame } from './renderer';
import type { OrbFrame } from './types';

function createContext(): { context: CanvasRenderingContext2D; fills: string[] } {
  const fills: string[] = [];
  let fillStyle = '';
  const context = {
    save() {},
    restore() {},
    beginPath() {},
    arc() {},
    fill() {
      fills.push(fillStyle);
    },
    stroke() {},
    fillRect() {},
    moveTo() {},
    lineTo() {},
    quadraticCurveTo() {},
    set fillStyle(value: string) {
      fillStyle = value;
    },
    get fillStyle() {
      return fillStyle;
    },
  } as unknown as CanvasRenderingContext2D;
  return { context, fills };
}

describe('frame palette rendering', () => {
  const frame: OrbFrame = {
    dots: [
      { x: 1, y: 1, z: 0, radius: 1, alpha: 1, paletteRole: 0 },
      { x: 2, y: 2, z: 0, radius: 1, alpha: 1, paletteRole: 1 },
      { x: 3, y: 3, z: 0, radius: 1, alpha: 1, paletteRole: 2 },
    ],
    lines: [],
    rects: [],
    arcs: [],
  };

  it('cycles a short palette through stable visual roles', () => {
    const { context, fills } = createContext();
    paintFrame(context, frame, 'dark', -1, undefined, ['#ff5a36', '#635bff']);

    expect(fills).toEqual(['#ff5a36', '#635bff', '#ff5a36']);
  });

  it('uses palette precedence over a single colour and hue override', () => {
    const { context, fills } = createContext();
    paintFrame(context, frame, 'dark', 120, '#111111', ['#2ea44f']);

    expect(fills).toEqual(['#2ea44f', '#2ea44f', '#2ea44f']);
  });

  it('keeps explicitly native material out of a caller palette', () => {
    const { context, fills } = createContext();
    paintFrame(context, { ...frame, dots: [{ ...frame.dots[0], paletteRole: null }] }, 'dark', -1, undefined, [
      '#ff5a36',
    ]);

    expect(fills).toEqual(['rgba(143, 143, 143, 1)']);
  });
});
