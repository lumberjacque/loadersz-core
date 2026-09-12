export { FRAME_BUILDERS } from '../src/core/modes/registry';
export { paintFrame } from '../src/core/renderer';
export type { FrameContext, OrbFrame, OrbMode } from '../src/core/types';

/**
 * Intentional geometry revisions that cannot be byte-for-byte equal to an older benchmark bundle.
 *
 * The equivalence runner compares these revisions exactly again once both the baseline and candidate
 * expose the same version. Bump a mode only for a reviewed visual change.
 */
export const FRAME_VISUAL_VERSIONS = Object.freeze({
  treemap: 2,
  retry: 2,
  scanner: 2,
});
