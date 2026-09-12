import { describe, expect, it } from 'vitest';
import { LOADER_CATEGORIES, LOADER_STATES, STATE_TO_MODE } from './state-registry';

describe('state registry', () => {
  it('exposes every direct-import state exactly once and in registry order', () => {
    expect(LOADER_STATES).toHaveLength(160);
    expect(LOADER_STATES).toEqual(Object.keys(STATE_TO_MODE));
    expect(new Set(LOADER_STATES)).toHaveLength(LOADER_STATES.length);
  });

  it('keeps the published state list immutable', () => {
    expect(Object.isFrozen(LOADER_STATES)).toBe(true);
  });

  it('places every state in exactly one public category', () => {
    const categorized = LOADER_CATEGORIES.flatMap((category) => category.states);
    expect(categorized).toHaveLength(LOADER_STATES.length);
    expect(new Set(categorized)).toEqual(new Set(LOADER_STATES));
  });

  it('groups reasoning and system states by their semantic role', () => {
    const reasoning = LOADER_CATEGORIES.find((category) => category.id === 'reasoning')?.states ?? [];
    const motion = LOADER_CATEGORIES.find((category) => category.id === 'motion')?.states ?? [];
    const systems = LOADER_CATEGORIES.find((category) => category.id === 'systems')?.states ?? [];
    expect(reasoning.slice(0, 7)).toEqual([
      'breathing',
      'listening',
      'connecting',
      'searching',
      'observing',
      'shaping',
      'weaving',
    ]);
    expect(reasoning).toEqual(expect.arrayContaining(['settling']));
    expect(systems).toEqual(expect.arrayContaining(['prioritizing', 'verifying']));
    expect(motion).not.toEqual(
      expect.arrayContaining(['breathing', 'listening', 'connecting', 'searching', 'observing', 'shaping', 'weaving']),
    );
  });
});
