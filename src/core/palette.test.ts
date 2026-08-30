import { describe, expect, it } from 'vitest';
import { assignFallbackPaletteRoles, parsePaletteAttribute } from './palette';

describe('palette attribute parsing', () => {
  it('uses semicolons so functional CSS colours keep their commas', () => {
    expect(parsePaletteAttribute(' #ff5a36; rgb(42, 68, 255); var(--brand) ')).toEqual([
      '#ff5a36',
      'rgb(42, 68, 255)',
      'var(--brand)',
    ]);
  });

  it('removes empty entries and caps the palette at eight colours', () => {
    expect(parsePaletteAttribute('a; ;b;c;d;e;f;g;h;i')).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  });

  it('assigns stable fallback roles only to untagged monochrome geometry', () => {
    const frame = {
      dots: [
        { x: 0, y: 0, z: 0, radius: 1, alpha: 1 },
        { x: 1, y: 0, z: 0, radius: 1, alpha: 1, paletteRole: null },
        { x: 2, y: 0, z: 0, radius: 1, alpha: 1, tone: 42 },
        { x: 3, y: 0, z: 0, radius: 1, alpha: 1 },
      ],
      lines: [],
      rects: [],
      arcs: [],
    };

    assignFallbackPaletteRoles(frame, 3);

    expect(frame.dots.map((dot) => dot.paletteRole)).toEqual([0, null, undefined, 1]);
  });
});
