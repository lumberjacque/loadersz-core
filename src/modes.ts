import { CanvasLoader } from './core/CanvasLoader';
import type { FrameBuilder } from './core/CanvasLoader';
import {
  atlasFrame,
  apertureFrame,
  associateFrame,
  auroraFrame,
  areaFrame,
  barChartFrame,
  bubbleChartFrame,
  bufferFrame,
  beatsFrame,
  branchFrame,
  bubblesFrame,
  cascadeFrame,
  condenseFrame,
  comparisonFrame,
  considerFrame,
  circuitFrame,
  cognitionFrame,
  cometFrame,
  constellationFrame,
  crystalFrame,
  cubeFrame,
  convergeFrame,
  deduceFrame,
  donutFrame,
  evaluateFrame,
  flickerFrame,
  glimmerFrame,
  harmonyFrame,
  imagineFrame,
  illuminateFrame,
  disperseFrame,
  eclipseFrame,
  ellipsisFrame,
  exploreFrame,
  echoFrame,
  firefliesFrame,
  flockFrame,
  flowerFrame,
  forgeFrame,
  funnelFrame,
  gaugeFrame,
  galaxyFrame,
  gyroscopeFrame,
  haloFrame,
  helixFrame,
  juggleFrame,
  knotFrame,
  levitateFrame,
  magnetFrame,
  matrixFrame,
  memoryFrame,
  mirrorFrame,
  mobileFrame,
  morphFrame,
  networkFrame,
  novaFrame,
  orbitFrame,
  origamiFrame,
  pinwheelFrame,
  plasmaFrame,
  portalFrame,
  prismFrame,
  processFrame,
  pulseFrame,
  queryFrame,
  queueFrame,
  radianceFrame,
  resonanceFrame,
  reasonFrame,
  resolveFrame,
  ribbonFrame,
  satellitesFrame,
  scanFrame,
  scalesFrame,
  shimmerFrame,
  sparkleFrame,
  spinnerFrame,
  surfaceFrame,
  shardsFrame,
  swarmFrame,
  stackedFrame,
  synchronizeFrame,
  uploadFrame,
  tunnelFrame,
  traceFrame,
  treemapFrame,
  timelineFrame,
  throughputFrame,
  unravelFrame,
  vortexFrame,
  waveFrame,
  weaveFrame,
  latticeFrame,
  linkFrame,
  twinkleFrame,
  vibrateFrame,
} from './core/modes';
import type { LoaderszOrbOptions, OrbState } from './core/types';

/** Options for a fixed-mode loader. `state` is intentionally unavailable because the import selects it. */
export type LoaderszModeOptions = Omit<LoaderszOrbOptions, 'state'>;

/** Imperative controller returned by one of the fixed-mode factories. */
export class LoaderszModeLoader extends CanvasLoader {}

/**
 * Creates a factory whose imported frame builder remains independently tree-shakeable.
 *
 * Import one named factory in an ESM-aware production bundler to exclude every other geometry.
 *
 * @param state Semantic state permanently applied by the returned factory.
 * @param builder Pure geometry builder for that state.
 * @returns A canvas factory that accepts all loader options except `state`.
 */
function defineMode(state: OrbState, builder: FrameBuilder) {
  return (canvas: HTMLCanvasElement, options: LoaderszModeOptions = {}): LoaderszModeLoader =>
    new LoaderszModeLoader(canvas, { ...options, state }, builder);
}

/** Tree-shakeable factories for each semantic loader state. */
export const working = defineMode('working', orbitFrame);
export const searching = defineMode('searching', scanFrame);
export const connecting = defineMode('connecting', networkFrame);
export const weaving = defineMode('weaving', weaveFrame);
export const shaping = defineMode('shaping', morphFrame);
export const listening = defineMode('listening', waveFrame);
export const breathing = defineMode('breathing', pulseFrame);
export const composing = defineMode('composing', ribbonFrame);
export const solving = defineMode('solving', cubeFrame);
export const observing = defineMode('observing', haloFrame);
export const dreaming = defineMode('dreaming', tunnelFrame);
export const charging = defineMode('charging', swarmFrame);
export const flowing = defineMode('flowing', knotFrame);
export const awakening = defineMode('awakening', novaFrame);
export const coding = defineMode('coding', circuitFrame);
export const transcending = defineMode('transcending', portalFrame);
export const singing = defineMode('singing', auroraFrame);
export const growing = defineMode('growing', helixFrame);
export const blooming = defineMode('blooming', flowerFrame);
export const wandering = defineMode('wandering', firefliesFrame);
export const decoding = defineMode('decoding', matrixFrame);
export const calibrating = defineMode('calibrating', gyroscopeFrame);
export const attracting = defineMode('attracting', magnetFrame);
export const shattering = defineMode('shattering', shardsFrame);
export const crystallizing = defineMode('crystallizing', crystalFrame);
export const constellating = defineMode('constellating', constellationFrame);
export const folding = defineMode('folding', origamiFrame);
export const echoing = defineMode('echoing', echoFrame);
export const balancing = defineMode('balancing', mobileFrame);
export const weathering = defineMode('weathering', vortexFrame);
export const mapping = defineMode('mapping', atlasFrame);
export const forging = defineMode('forging', forgeFrame);
export const orbiting = defineMode('orbiting', satellitesFrame);
export const racing = defineMode('racing', cometFrame);
export const bubbling = defineMode('bubbling', bubblesFrame);
export const spinning = defineMode('spinning', pinwheelFrame);
export const electrifying = defineMode('electrifying', plasmaFrame);
export const flocking = defineMode('flocking', flockFrame);
export const throbbing = defineMode('throbbing', beatsFrame);
export const cascading = defineMode('cascading', cascadeFrame);
export const spiraling = defineMode('spiraling', galaxyFrame);
export const juggling = defineMode('juggling', juggleFrame);
export const eclipsing = defineMode('eclipsing', eclipseFrame);
export const resonating = defineMode('resonating', resonanceFrame);
export const condensing = defineMode('condensing', condenseFrame);
export const dispersing = defineMode('dispersing', disperseFrame);
export const prisming = defineMode('prisming', prismFrame);
export const levitating = defineMode('levitating', levitateFrame);
export const synchronizing = defineMode('synchronizing', synchronizeFrame);
export const unraveling = defineMode('unraveling', unravelFrame);
export const pondering = defineMode('pondering', latticeFrame);
export const deducing = defineMode('deducing', deduceFrame);
export const branching = defineMode('branching', branchFrame);
export const focusing = defineMode('focusing', apertureFrame);
export const reflecting = defineMode('reflecting', mirrorFrame);
export const weighing = defineMode('weighing', scalesFrame);
export const recalling = defineMode('recalling', memoryFrame);
export const tracing = defineMode('tracing', traceFrame);
export const converging = defineMode('converging', convergeFrame);
export const questioning = defineMode('questioning', queryFrame);
export const glimmering = defineMode('glimmering', glimmerFrame);
export const radiating = defineMode('radiating', radianceFrame);
export const harmonizing = defineMode('harmonizing', harmonyFrame);
export const twinkling = defineMode('twinkling', twinkleFrame);
export const flickering = defineMode('flickering', flickerFrame);
export const shimmering = defineMode('shimmering', shimmerFrame);
export const surfacing = defineMode('surfacing', surfaceFrame);
export const vibrating = defineMode('vibrating', vibrateFrame);
export const illuminating = defineMode('illuminating', illuminateFrame);
export const sparkling = defineMode('sparkling', sparkleFrame);
export const loading = defineMode('loading', spinnerFrame);
export const buffering = defineMode('buffering', bufferFrame);
export const typing = defineMode('typing', ellipsisFrame);
export const processing = defineMode('processing', processFrame);
export const synthesizing = defineMode('synthesizing', reasonFrame);
export const considering = defineMode('considering', considerFrame);
export const uploading = defineMode('uploading', uploadFrame);
export const queuing = defineMode('queuing', queueFrame);
export const associating = defineMode('associating', associateFrame);
export const evaluating = defineMode('evaluating', evaluateFrame);
export const reasoning = defineMode('reasoning', cognitionFrame);
export const exploring = defineMode('exploring', exploreFrame);
export const linking = defineMode('linking', linkFrame);
export const resolving = defineMode('resolving', resolveFrame);
export const imagining = defineMode('imagining', imagineFrame);
export const barCharting = defineMode('bar-charting', barChartFrame);
export const comparing = defineMode('comparing', comparisonFrame);
export const accumulating = defineMode('accumulating', stackedFrame);
export const sequencing = defineMode('sequencing', timelineFrame);
export const transmitting = defineMode('transmitting', throughputFrame);
export const summarizing = defineMode('summarizing', donutFrame);
export const gauging = defineMode('gauging', gaugeFrame);
export const funneling = defineMode('funneling', funnelFrame);
export const treemapping = defineMode('treemapping', treemapFrame);
export const bubbleCharting = defineMode('bubble-charting', bubbleChartFrame);
export const areamapping = defineMode('areamapping', areaFrame);
