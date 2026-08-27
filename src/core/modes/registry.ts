import type { FrameContext, OrbFrame, OrbMode } from './shared';
import * as foundational from './foundational';
import * as kinetic from './kinetic';
import * as reasoning from './reasoning';
import * as atmospheric from './atmospheric';
import * as classicLoaders from './classic-loaders';
import * as utilityLoaders from './utility-loaders';

const BUILDERS = { ...foundational, ...kinetic, ...reasoning, ...atmospheric, ...classicLoaders, ...utilityLoaders };
type FrameBuilder = (context: FrameContext) => OrbFrame;

/** Lookup table for every bundled pure geometry builder. */
export const FRAME_BUILDERS: Record<OrbMode, FrameBuilder> = {
  orbit: BUILDERS.orbitFrame,
  scan: BUILDERS.scanFrame,
  network: BUILDERS.networkFrame,
  weave: BUILDERS.weaveFrame,
  morph: BUILDERS.morphFrame,
  wave: BUILDERS.waveFrame,
  pulse: BUILDERS.pulseFrame,
  ribbon: BUILDERS.ribbonFrame,
  crystal: BUILDERS.crystalFrame,
  halo: BUILDERS.haloFrame,
  cube: BUILDERS.cubeFrame,
  tunnel: BUILDERS.tunnelFrame,
  swarm: BUILDERS.swarmFrame,
  knot: BUILDERS.knotFrame,
  aurora: BUILDERS.auroraFrame,
  nova: BUILDERS.novaFrame,
  circuit: BUILDERS.circuitFrame,
  portal: BUILDERS.portalFrame,
  helix: BUILDERS.helixFrame,
  flower: BUILDERS.flowerFrame,
  fireflies: BUILDERS.firefliesFrame,
  matrix: BUILDERS.matrixFrame,
  gyroscope: BUILDERS.gyroscopeFrame,
  magnet: BUILDERS.magnetFrame,
  shards: BUILDERS.shardsFrame,
  constellation: BUILDERS.constellationFrame,
  origami: BUILDERS.origamiFrame,
  echo: BUILDERS.echoFrame,
  mobile: BUILDERS.mobileFrame,
  vortex: BUILDERS.vortexFrame,
  atlas: BUILDERS.atlasFrame,
  forge: BUILDERS.forgeFrame,
  satellites: BUILDERS.satellitesFrame,
  comet: BUILDERS.cometFrame,
  bubbles: BUILDERS.bubblesFrame,
  pinwheel: BUILDERS.pinwheelFrame,
  plasma: BUILDERS.plasmaFrame,
  flock: BUILDERS.flockFrame,
  beats: BUILDERS.beatsFrame,
  cascade: BUILDERS.cascadeFrame,
  galaxy: BUILDERS.galaxyFrame,
  juggle: BUILDERS.juggleFrame,
  eclipse: BUILDERS.eclipseFrame,
  resonance: BUILDERS.resonanceFrame,
  condense: BUILDERS.condenseFrame,
  disperse: BUILDERS.disperseFrame,
  prism: BUILDERS.prismFrame,
  levitate: BUILDERS.levitateFrame,
  synchronize: BUILDERS.synchronizeFrame,
  unravel: BUILDERS.unravelFrame,
  lattice: BUILDERS.latticeFrame,
  deduce: BUILDERS.deduceFrame,
  branch: BUILDERS.branchFrame,
  aperture: BUILDERS.apertureFrame,
  mirror: BUILDERS.mirrorFrame,
  scales: BUILDERS.scalesFrame,
  memory: BUILDERS.memoryFrame,
  trace: BUILDERS.traceFrame,
  converge: BUILDERS.convergeFrame,
  query: BUILDERS.queryFrame,
  glimmer: BUILDERS.glimmerFrame,
  radiance: BUILDERS.radianceFrame,
  harmony: BUILDERS.harmonyFrame,
  twinkle: BUILDERS.twinkleFrame,
  flicker: BUILDERS.flickerFrame,
  shimmer: BUILDERS.shimmerFrame,
  surface: BUILDERS.surfaceFrame,
  vibrate: BUILDERS.vibrateFrame,
  illuminate: BUILDERS.illuminateFrame,
  sparkle: BUILDERS.sparkleFrame,
  spinner: BUILDERS.spinnerFrame,
  buffer: BUILDERS.bufferFrame,
  ellipsis: BUILDERS.ellipsisFrame,
  process: BUILDERS.processFrame,
  reason: BUILDERS.reasonFrame,
  consider: BUILDERS.considerFrame,
  upload: BUILDERS.uploadFrame,
  queue: BUILDERS.queueFrame,
  associate: BUILDERS.associateFrame,
  evaluate: BUILDERS.evaluateFrame,
  cognition: BUILDERS.cognitionFrame,
  explore: BUILDERS.exploreFrame,
  link: BUILDERS.linkFrame,
  resolve: BUILDERS.resolveFrame,
  imagine: BUILDERS.imagineFrame,
  bars: BUILDERS.barsFrame,
  progress: BUILDERS.progressFrame,
  skeleton: BUILDERS.skeletonFrame,
  waveform: BUILDERS.waveformFrame,
  grid: BUILDERS.gridFrame,
  radar: BUILDERS.radarFrame,
  hourglass: BUILDERS.hourglassFrame,
  rings: BUILDERS.ringsFrame,
  signal: BUILDERS.signalFrame,
  steps: BUILDERS.stepsFrame,
  stream: BUILDERS.streamFrame,
  equalizer: BUILDERS.equalizerFrame,
  circuitboard: BUILDERS.circuitboardFrame,
  marquee: BUILDERS.marqueeFrame,
  orbitdots: BUILDERS.orbitdotsFrame,
};

/**
 * Creates deterministic geometry for one visual state at one point in time.
 *
 * This function is DOM-free and has no Canvas dependency, making it useful for tests or custom
 * renderers. `context.time` is in seconds and the same values always produce the same frame.
 *
 * @param mode Low-level geometry name, normally resolved with `resolveMode` first.
 * @param context Animation time, canvas radius and density multiplier.
 * @returns Dots and lines ready for `paintFrame`.
 */
export function buildFrame(mode: OrbMode, context: FrameContext): OrbFrame {
  return FRAME_BUILDERS[mode](context);
}
