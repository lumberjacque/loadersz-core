import type { OrbMode, OrbState } from './types';

/** A semantic state name that has a matching direct import entry point. */
export type LoaderStateName = Exclude<OrbState, OrbMode>;

/**
 * Single source of truth for the public state names and their pure geometry builders.
 *
 * The runtime resolver, playground metadata, direct-entry verification and future documentation
 * generation all derive from this registry rather than maintaining independent state lists.
 */
export const STATE_TO_MODE: Record<LoaderStateName, OrbMode> = {
  working: 'orbit',
  searching: 'scan',
  connecting: 'network',
  weaving: 'weave',
  shaping: 'morph',
  listening: 'wave',
  breathing: 'pulse',
  composing: 'ribbon',
  solving: 'cube',
  observing: 'halo',
  dreaming: 'tunnel',
  charging: 'swarm',
  flowing: 'knot',
  awakening: 'nova',
  coding: 'circuit',
  transcending: 'portal',
  singing: 'aurora',
  growing: 'helix',
  blooming: 'flower',
  wandering: 'fireflies',
  decoding: 'matrix',
  calibrating: 'gyroscope',
  attracting: 'magnet',
  shattering: 'shards',
  crystallizing: 'crystal',
  constellating: 'constellation',
  folding: 'origami',
  echoing: 'echo',
  balancing: 'mobile',
  weathering: 'vortex',
  mapping: 'atlas',
  forging: 'forge',
  orbiting: 'satellites',
  racing: 'comet',
  bubbling: 'bubbles',
  spinning: 'pinwheel',
  electrifying: 'plasma',
  flocking: 'flock',
  throbbing: 'beats',
  cascading: 'cascade',
  spiraling: 'galaxy',
  juggling: 'juggle',
  eclipsing: 'eclipse',
  resonating: 'resonance',
  condensing: 'condense',
  dispersing: 'disperse',
  prisming: 'prism',
  levitating: 'levitate',
  synchronizing: 'synchronize',
  unraveling: 'unravel',
  pondering: 'lattice',
  deducing: 'deduce',
  branching: 'branch',
  focusing: 'aperture',
  reflecting: 'mirror',
  weighing: 'scales',
  recalling: 'memory',
  tracing: 'trace',
  converging: 'converge',
  questioning: 'query',
  glimmering: 'glimmer',
  radiating: 'radiance',
  harmonizing: 'harmony',
  twinkling: 'twinkle',
  flickering: 'flicker',
  shimmering: 'shimmer',
  surfacing: 'surface',
  vibrating: 'vibrate',
  illuminating: 'illuminate',
  sparkling: 'sparkle',
  loading: 'spinner',
  buffering: 'buffer',
  typing: 'ellipsis',
  processing: 'process',
  synthesizing: 'reason',
  considering: 'consider',
  uploading: 'upload',
  queuing: 'queue',
  associating: 'associate',
  evaluating: 'evaluate',
  reasoning: 'cognition',
  exploring: 'explore',
  linking: 'link',
  resolving: 'resolve',
  imagining: 'imagine',
  'loading-bars': 'bars',
  progressing: 'progress',
  placeholder: 'skeleton',
  monitoring: 'waveform',
  checking: 'grid',
  tracking: 'radar',
  waiting: 'hourglass',
  pulsing: 'rings',
  signaling: 'signal',
  stepping: 'steps',
  streaming: 'stream',
  equalizing: 'equalizer',
  wiring: 'circuitboard',
  marqueeing: 'marquee',
  'orbiting-dots': 'orbitdots',
};

/** Ordered semantic state names used by consumers that need to enumerate the full library. */
export const LOADER_STATES = Object.freeze(Object.keys(STATE_TO_MODE) as LoaderStateName[]);

/** A named, ordered grouping of states for selectors, documentation and galleries. */
export interface LoaderCategory {
  /** Stable machine-readable category identifier. */
  readonly id: 'loaders' | 'reasoning' | 'motion';
  /** Human-readable category heading. */
  readonly label: string;
  /** States that belong to this category, in gallery order. */
  readonly states: readonly LoaderStateName[];
}

const loaderStates = [
  'loading',
  'buffering',
  'typing',
  'processing',
  'uploading',
  'queuing',
  'loading-bars',
  'progressing',
  'placeholder',
  'monitoring',
  'checking',
  'tracking',
  'waiting',
  'pulsing',
  'signaling',
  'stepping',
  'streaming',
  'equalizing',
  'wiring',
  'marqueeing',
  'orbiting-dots',
] as const satisfies readonly LoaderStateName[];

const reasoningStates = [
  'pondering',
  'deducing',
  'branching',
  'focusing',
  'reflecting',
  'weighing',
  'recalling',
  'tracing',
  'converging',
  'questioning',
  'considering',
  'associating',
  'evaluating',
  'reasoning',
  'exploring',
  'linking',
  'resolving',
  'imagining',
] as const satisfies readonly LoaderStateName[];

const categorizedStates = new Set<LoaderStateName>([...loaderStates, ...reasoningStates]);

/** Public category metadata. Every state appears exactly once. */
export const LOADER_CATEGORIES = Object.freeze([
  Object.freeze({ id: 'loaders' as const, label: 'Loaders', states: Object.freeze([...loaderStates]) }),
  Object.freeze({ id: 'reasoning' as const, label: 'Reasoning', states: Object.freeze([...reasoningStates]) }),
  Object.freeze({
    id: 'motion' as const,
    label: 'Motion studies',
    states: Object.freeze(LOADER_STATES.filter((state) => !categorizedStates.has(state))),
  }),
] satisfies readonly LoaderCategory[]);
