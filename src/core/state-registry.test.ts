import { describe, expect, it } from 'vitest';
import { LOADER_STATES, STATE_TO_MODE } from './state-registry';

describe('state registry', () => {
  it('exposes every direct-import state exactly once and in registry order', () => {
    expect(LOADER_STATES).toHaveLength(85);
    expect(LOADER_STATES).toEqual(Object.keys(STATE_TO_MODE));
    expect(new Set(LOADER_STATES)).toHaveLength(LOADER_STATES.length);
  });

  it('keeps the published state list immutable', () => {
    expect(Object.isFrozen(LOADER_STATES)).toBe(true);
  });
});
