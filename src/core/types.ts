/** Low-level geometry names. Prefer {@link OrbState} in product UI. */
export type OrbMode =
  | 'orbit'
  | 'scan'
  | 'network'
  | 'weave'
  | 'morph'
  | 'wave'
  | 'pulse'
  | 'ribbon'
  | 'crystal'
  | 'halo'
  | 'cube'
  | 'tunnel'
  | 'swarm'
  | 'knot'
  | 'aurora'
  | 'nova'
  | 'circuit'
  | 'portal'
  | 'helix'
  | 'flower'
  | 'fireflies'
  | 'matrix'
  | 'gyroscope'
  | 'magnet'
  | 'shards'
  | 'constellation'
  | 'origami'
  | 'echo'
  | 'mobile'
  | 'vortex'
  | 'atlas'
  | 'forge'
  | 'satellites'
  | 'comet'
  | 'bubbles'
  | 'pinwheel'
  | 'plasma'
  | 'flock'
  | 'beats'
  | 'cascade'
  | 'galaxy'
  | 'juggle'
  | 'eclipse'
  | 'resonance'
  | 'condense'
  | 'disperse'
  | 'prism'
  | 'levitate'
  | 'synchronize'
  | 'unravel'
  | 'lattice'
  | 'deduce'
  | 'branch'
  | 'aperture'
  | 'mirror'
  | 'scales'
  | 'memory'
  | 'trace'
  | 'converge'
  | 'query'
  | 'glimmer'
  | 'radiance'
  | 'harmony'
  | 'twinkle'
  | 'flicker'
  | 'shimmer'
  | 'surface'
  | 'vibrate'
  | 'illuminate'
  | 'sparkle'
  | 'spinner'
  | 'buffer'
  | 'ellipsis'
  | 'process'
  | 'reason'
  | 'consider'
  | 'upload'
  | 'queue'
  | 'associate'
  | 'evaluate'
  | 'cognition'
  | 'explore'
  | 'link'
  | 'resolve'
  | 'imagine'
  | 'bars'
  | 'progress'
  | 'skeleton'
  | 'waveform'
  | 'grid'
  | 'radar'
  | 'hourglass'
  | 'rings'
  | 'signal'
  | 'steps'
  | 'stream'
  | 'equalizer'
  | 'circuitboard'
  | 'marquee'
  | 'orbitdots'
  | 'chart'
  | 'plot'
  | 'scatter'
  | 'forecast'
  | 'meter'
  | 'heatmap'
  | 'candles'
  | 'graph'
  | 'waterfall'
  | 'clusters'
  | 'index'
  | 'benchmark'
  | 'profile'
  | 'histogram'
  | 'aggregate'
  | 'scrubber'
  | 'telemetryreadout'
  | 'poll'
  | 'correlation'
  | 'flowmap'
  | 'barchart'
  | 'comparison'
  | 'stacked'
  | 'timeline'
  | 'throughput'
  | 'donut'
  | 'gauge'
  | 'funnel'
  | 'treemap'
  | 'area'
  | 'download'
  | 'retry'
  | 'scanner'
  | 'compile'
  | 'pagination'
  | 'reconnect'
  | 'sankey'
  | 'radarplot'
  | 'gantt'
  | 'calendar'
  | 'bullet'
  | 'boxplot'
  | 'dispatch'
  | 'batch'
  | 'checkpoint'
  | 'priority'
  | 'verify'
  | 'pendulum'
  | 'drift'
  | 'rain';

/** Semantic states that map to a visual geometry without coupling callers to an implementation detail. */
export type OrbState =
  | 'working'
  | 'searching'
  | 'connecting'
  | 'weaving'
  | 'shaping'
  | 'listening'
  | 'breathing'
  | 'composing'
  | 'solving'
  | 'observing'
  | 'dreaming'
  | 'charging'
  | 'flowing'
  | 'awakening'
  | 'coding'
  | 'transcending'
  | 'singing'
  | 'growing'
  | 'blooming'
  | 'wandering'
  | 'decoding'
  | 'calibrating'
  | 'attracting'
  | 'shattering'
  | 'crystallizing'
  | 'constellating'
  | 'folding'
  | 'echoing'
  | 'balancing'
  | 'weathering'
  | 'mapping'
  | 'forging'
  | 'orbiting'
  | 'racing'
  | 'bubbling'
  | 'spinning'
  | 'electrifying'
  | 'flocking'
  | 'throbbing'
  | 'cascading'
  | 'spiraling'
  | 'juggling'
  | 'eclipsing'
  | 'resonating'
  | 'condensing'
  | 'dispersing'
  | 'prisming'
  | 'levitating'
  | 'synchronizing'
  | 'unraveling'
  | 'pondering'
  | 'deducing'
  | 'branching'
  | 'focusing'
  | 'reflecting'
  | 'weighing'
  | 'recalling'
  | 'tracing'
  | 'converging'
  | 'questioning'
  | 'glimmering'
  | 'radiating'
  | 'harmonizing'
  | 'twinkling'
  | 'flickering'
  | 'shimmering'
  | 'surfacing'
  | 'vibrating'
  | 'illuminating'
  | 'sparkling'
  | 'loading'
  | 'buffering'
  | 'typing'
  | 'processing'
  | 'synthesizing'
  | 'considering'
  | 'uploading'
  | 'queuing'
  | 'associating'
  | 'evaluating'
  | 'reasoning'
  | 'exploring'
  | 'linking'
  | 'resolving'
  | 'imagining'
  | 'loading-bars'
  | 'progressing'
  | 'placeholder'
  | 'monitoring'
  | 'checking'
  | 'tracking'
  | 'waiting'
  | 'pulsing'
  | 'signaling'
  | 'stepping'
  | 'streaming'
  | 'equalizing'
  | 'wiring'
  | 'marqueeing'
  | 'orbiting-dots'
  | 'charting'
  | 'plotting'
  | 'sampling'
  | 'forecasting'
  | 'metering'
  | 'heatmapping'
  | 'candlesticking'
  | 'graphing'
  | 'waterfalling'
  | 'clustering'
  | 'indexing'
  | 'benchmarking'
  | 'profiling'
  | 'binning'
  | 'aggregating'
  | 'scrubbing'
  | 'telemetry'
  | 'polling'
  | 'correlating'
  | 'routing'
  | 'bar-charting'
  | 'comparing'
  | 'accumulating'
  | 'sequencing'
  | 'transmitting'
  | 'summarizing'
  | 'gauging'
  | 'funneling'
  | 'treemapping'
  | 'areamapping'
  | 'downloading'
  | 'retrying'
  | 'scanning'
  | 'compiling'
  | 'paginating'
  | 'reconnecting'
  | 'sankeying'
  | 'radaring'
  | 'scheduling'
  | 'calendarizing'
  | 'bulletting'
  | 'boxing'
  | 'dispatching'
  | 'batching'
  | 'checkpointing'
  | 'prioritizing'
  | 'verifying'
  | 'pendulating'
  | 'drifting'
  | 'raining'
  | OrbMode;

/** Canvas colour scheme. `auto` follows the browser's `prefers-color-scheme` media query. */
export type OrbTheme = 'auto' | 'dark' | 'light';

/**
 * Construction and update values accepted by {@link LoaderszLoader} and `<loadersz-loader>`.
 *
 * Attribute values on the custom element are strings; the element converts supported numeric
 * attributes (`size`, `speed`, `density`, `particle-radius` and `hue`) before forwarding this object to the renderer.
 */
export interface LoaderszOrbOptions {
  /** Semantic state or a low-level geometry mode. Defaults to `working`. */
  state?: OrbState;
  /** Square canvas side in CSS pixels. Values below 16 are clamped to 16. Defaults to `96`. */
  size?: number;
  /** Timeline multiplier. `1` is normal speed; values above or below it speed up or slow down motion. */
  speed?: number;
  /** Colour scheme used for the points and lines. Defaults to `auto`. */
  theme?: OrbTheme;
  /** Stops frame scheduling while keeping the last rendered frame visible. */
  paused?: boolean;
  /** Continue animating even when the operating system requests reduced motion. */
  forceMotion?: boolean;
  /** Accessible text applied to the backing canvas, for example `"Searching"`. */
  ariaLabel?: string;
  /** Geometry detail multiplier. The renderer clamps it to `0.35`–`2`; default is `1`. */
  density?: number;
  /** Multiplies dot and arc widths and controls rectangle corner rounding. Values are clamped to `0.5`–`2.5`; default is `1`. */
  particleRadius?: number;
  /** -1 keeps a mode's native/monochrome look; 0–360 forces one hue. */
  hue?: number;
  /** A CSS colour such as `#c8f135`, `oklch(78% 0.18 118)`, or `var(--brand)`. When present, it overrides `hue`. */
  color?: string;
}

/** A 2D point after a 3D coordinate has been projected onto the canvas. */
export interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
}

/** A drawable circular particle. `tone` is an optional HSL hue used by colourful modes. */
export interface Dot extends ProjectedPoint {
  radius: number;
  alpha: number;
  tone?: number;
}

/** A drawable line segment between two projected points. */
export interface OrbLine {
  from: ProjectedPoint;
  to: ProjectedPoint;
  alpha: number;
  width: number;
  tone?: number;
}

/** A filled rectangular mark, used by chart and interface-like visual states. */
export interface OrbRect extends ProjectedPoint {
  /** Left edge in canvas CSS pixels. */
  x: number;
  /** Top edge in canvas CSS pixels. */
  y: number;
  /** Rectangle width in canvas CSS pixels. */
  width: number;
  /** Rectangle height in canvas CSS pixels. */
  height: number;
  /** Opacity of the filled rectangle. */
  alpha: number;
  /** Optional HSL hue used by colourful modes. */
  tone?: number;
}

/** A stroked circular arc, used by gauges and segmented circular charts. */
export interface OrbArc extends ProjectedPoint {
  /** Arc centre in canvas CSS pixels. */
  x: number;
  /** Arc centre in canvas CSS pixels. */
  y: number;
  /** Arc radius in canvas CSS pixels. */
  radius: number;
  /** Start angle in radians. */
  startAngle: number;
  /** End angle in radians. */
  endAngle: number;
  /** Stroke width in canvas CSS pixels. */
  width: number;
  /** Arc opacity. */
  alpha: number;
  /** Optional HSL hue used by colourful modes. */
  tone?: number;
  /** End-cap shape. `round` is the default; `butt` preserves precise segment gaps. */
  cap?: 'round' | 'butt';
}

/** A filled polygon, used for angular interface surfaces and isometric visual states. */
export interface OrbPolygon extends ProjectedPoint {
  /** Ordered canvas vertices. A polygon always contains at least three points. */
  points: readonly ProjectedPoint[];
  /** Opacity of the filled polygon. */
  alpha: number;
  /** Optional HSL hue used by colourful modes. */
  tone?: number;
}

/** Complete geometry for one canvas frame. Builders create this; the renderer paints it. */
export interface OrbFrame {
  dots: Dot[];
  lines: OrbLine[];
  rects: OrbRect[];
  arcs: OrbArc[];
  polygons: OrbPolygon[];
}

/** Values supplied to each pure frame builder. `time` is measured in seconds. */
export interface FrameContext {
  time: number;
  radius: number;
  density: number;
  /** Shape-thickness multiplier supplied by the canvas controller; defaults to `1` for custom renderers. */
  particleRadius?: number;
}

export type Vector3 = [number, number, number];
