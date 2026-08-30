import { describe, expect, it } from 'vitest';
import { mergeOptions, normalizePalette, resolveMode } from './options';

describe('orb options', () => {
  it('maps semantic states to visual modes', () => {
    expect(resolveMode('listening')).toBe('wave');
    expect(resolveMode('solving')).toBe('cube');
    expect(resolveMode('halo')).toBe('halo');
  });

  it.each([
    ['calibrating', 'gyroscope'],
    ['attracting', 'magnet'],
    ['shattering', 'shards'],
    ['constellating', 'constellation'],
    ['folding', 'origami'],
    ['echoing', 'echo'],
    ['balancing', 'mobile'],
    ['weathering', 'vortex'],
    ['mapping', 'atlas'],
    ['forging', 'forge'],
    ['eclipsing', 'eclipse'],
    ['resonating', 'resonance'],
    ['condensing', 'condense'],
    ['dispersing', 'disperse'],
    ['prisming', 'prism'],
    ['levitating', 'levitate'],
    ['synchronizing', 'synchronize'],
    ['unraveling', 'unravel'],
    ['pondering', 'lattice'],
    ['deducing', 'deduce'],
    ['branching', 'branch'],
    ['focusing', 'aperture'],
    ['reflecting', 'mirror'],
    ['weighing', 'scales'],
    ['recalling', 'memory'],
    ['tracing', 'trace'],
    ['converging', 'converge'],
    ['questioning', 'query'],
    ['loading', 'spinner'],
    ['buffering', 'buffer'],
    ['typing', 'ellipsis'],
    ['processing', 'process'],
    ['synthesizing', 'reason'],
    ['considering', 'consider'],
    ['uploading', 'upload'],
    ['queuing', 'queue'],
    ['associating', 'associate'],
    ['evaluating', 'evaluate'],
    ['reasoning', 'cognition'],
    ['exploring', 'explore'],
    ['linking', 'link'],
    ['resolving', 'resolve'],
    ['imagining', 'imagine'],
  ] as const)('maps %s to %s', (state, mode) => {
    expect(resolveMode(state)).toBe(mode);
  });

  it('fills omitted options with safe defaults', () => {
    expect(mergeOptions({ speed: 1.5 })).toMatchObject({ state: 'working', speed: 1.5, theme: 'auto' });
  });

  it('normalizes palette entries without mutating the caller array', () => {
    const input = [' #ff5a36 ', '', 42 as unknown as string, '#635bff', '#2ea44f', '#f0c000', '#111', '#222', '#333'];

    expect(normalizePalette(input)).toEqual(['#ff5a36', '#635bff', '#2ea44f', '#f0c000', '#111', '#222', '#333']);
    expect(mergeOptions({ palette: input }).palette).not.toBe(input);
  });
});
