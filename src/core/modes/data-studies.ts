import type { FrameContext, OrbFrame, ProjectedPoint } from './shared';
import { addDot, addLine, createFrame, lerp, TAU } from './shared';

const centerOf = (radius: number) => radius / 0.82;

/** Builds `heatmapping`: a live intensity matrix swept by a warm analysis cursor. */
export function heatmapFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const cols = Math.max(6, Math.round(8 * density));
  const rows = Math.max(5, Math.round(6 * density));
  for (let y = 0; y < rows; y += 1)
    for (let x = 0; x < cols; x += 1) {
      const value = (Math.sin(time * 1.2 + x * 1.9 + y * 0.7) + Math.sin(time * 0.6 - x * 0.4 + y * 2.1) + 2) / 4;
      addDot(
        frame,
        {
          x: c + ((x - (cols - 1) / 2) * radius * 1.45) / cols,
          y: c + ((y - (rows - 1) / 2) * radius * 1.2) / rows,
          z: value,
        },
        0.35 + value * 0.95,
        0.12 + value * 0.78,
        215 - value * 185,
      );
    }
  return frame;
}

/** Builds `candlesticking`: a market-style tape of rising and falling candle bodies. */
export function candlesFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(7, Math.round(10 * density));
  for (let i = 0; i < count; i += 1) {
    const seed = Math.sin(i * 8.41);
    const open = Math.sin(time * 0.55 + i * 1.7) * 0.2;
    const close = open + Math.sin(time * 1.3 + i * 2.9) * 0.2;
    const x = c + ((i - (count - 1) / 2) * radius * 1.5) / count;
    addLine(
      frame,
      { x, y: c - (Math.max(open, close) + 0.23 + seed * 0.06) * radius, z: -0.1 },
      { x, y: c - (Math.min(open, close) - 0.23 - seed * 0.06) * radius, z: -0.1 },
      0.15,
      0.45,
      close >= open ? 144 : 8,
    );
    for (let dot = 0; dot < 4; dot += 1) {
      const p = dot / 3;
      addDot(frame, { x, y: c - lerp(open, close, p) * radius, z: p }, 0.58, 0.7, close >= open ? 144 : 8);
    }
  }
  return frame;
}

/** Builds `graphing`: a node graph with travelling relationships between active entities. */
export function nodegraphFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(7, Math.round(11 * density));
  const nodes = Array.from({ length: count }, (_, i) => ({
    x: c + Math.cos(i * 2.4 + time * 0.2) * radius * (0.3 + (i % 4) * 0.12),
    y: c + Math.sin(i * 1.7 - time * 0.25) * radius * (0.25 + (i % 3) * 0.14),
    z: (i % 3) * 0.2,
  }));
  nodes.forEach((node, i) => {
    const next = nodes[(i * 3 + 2) % count];
    addLine(frame, node, next, 0.1, 0.22, 194);
    const p = (time * 0.38 + i / count) % 1;
    addDot(frame, { x: lerp(node.x, next.x, p), y: lerp(node.y, next.y, p), z: 0.8 }, 0.64, 0.8, 194);
    addDot(frame, node, 0.75, 0.7, i % 2 ? 194 : 278);
  });
  return frame;
}

/** Builds `waterfalling`: layered event streams that cascade through a time-series display. */
export function waterfallFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const rows = Math.max(4, Math.round(6 * density));
  const samples = Math.max(14, Math.round(22 * density));
  for (let row = 0; row < rows; row += 1)
    for (let i = 0; i < samples; i += 1) {
      const p = i / samples;
      const energy = Math.max(0, Math.sin((p - time * 0.16 - row * 0.11) * TAU * 2));
      addDot(
        frame,
        {
          x: c + (p - 0.5) * radius * 1.58,
          y: c + (row - (rows - 1) / 2) * radius * 0.22 + energy * radius * 0.09,
          z: energy,
        },
        0.26 + energy * 0.8,
        0.1 + energy * 0.72,
        200 + row * 18,
      );
    }
  return frame;
}

/** Builds `clustering`: observations converge into shifting coloured groups. */
export function clustersFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const points = Math.max(20, Math.round(38 * density));
  for (let i = 0; i < points; i += 1) {
    const group = i % 3;
    const a = i * 2.4 + time * (group + 1) * 0.3;
    const cx = c + Math.cos(time * 0.4 + (group * TAU) / 3) * radius * 0.28;
    const cy = c + Math.sin(time * 0.36 + (group * TAU) / 3) * radius * 0.22;
    const spread = radius * (0.08 + (i % 7) * 0.018);
    addDot(
      frame,
      { x: cx + Math.cos(a) * spread, y: cy + Math.sin(a * 1.3) * spread, z: 0.2 + group * 0.2 },
      0.3 + (i % 3) * 0.12,
      0.35 + (i % 5) * 0.08,
      [42, 184, 286][group],
    );
  }
  return frame;
}

/** Builds `indexing`: records snap into an illuminated, moving index strip. */
export function indexFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(12, Math.round(22 * density));
  for (let i = 0; i < count; i += 1) {
    const p = (i / count + time * 0.23) % 1;
    const active = Math.pow(Math.max(0, Math.sin((p - 0.5) * Math.PI)), 5);
    addDot(
      frame,
      { x: c + (p - 0.5) * radius * 1.55, y: c + Math.sin(p * TAU * 2) * radius * 0.2, z: active },
      0.28 + active * 1,
      0.13 + active * 0.8,
      70 + active * 90,
    );
  }
  return frame;
}

/** Builds `benchmarking`: competing score columns continuously race toward a new baseline. */
export function benchmarkFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(4, Math.round(6 * density));
  for (let i = 0; i < count; i += 1) {
    const score = 0.24 + ((Math.sin(time * (0.8 + i * 0.09) + i * 1.7) + 1) / 2) * 0.62;
    const x = c + ((i - (count - 1) / 2) * radius * 1.38) / count;
    const dots = Math.max(3, Math.round(score * 9));
    for (let d = 0; d < dots; d += 1)
      addDot(
        frame,
        { x, y: c + (0.5 - d / Math.max(1, dots - 1)) * radius * score * 1.4, z: d / dots },
        0.42,
        0.25 + (d / dots) * 0.65,
        252 + i * 15,
      );
  }
  return frame;
}

/** Builds `profiling`: a stacked execution profile with a bright scanning sample. */
export function profileFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const rows = Math.max(4, Math.round(6 * density));
  const head = (time * 0.28) % 1;
  for (let row = 0; row < rows; row += 1) {
    const width = 0.38 + ((Math.sin(time + row * 2) + 1) / 2) * 0.43;
    const y = c + (row - (rows - 1) / 2) * radius * 0.21;
    for (let i = 0; i < 18; i += 1) {
      const p = i / 17;
      if (p > width) continue;
      const hot = Math.max(0, 1 - Math.abs(p / width - head) * 8);
      addDot(frame, { x: c + (p - 0.5) * radius * 1.62, y, z: hot }, 0.3 + hot * 0.6, 0.18 + hot * 0.7, 18 + row * 22);
    }
  }
  return frame;
}

/** Builds `binning`: a histogram re-bins incoming samples into evolving buckets. */
export function histogramFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const bins = Math.max(6, Math.round(9 * density));
  for (let i = 0; i < bins; i += 1) {
    const height = 0.15 + Math.pow((Math.sin(time * 1.15 + i * 1.9) + 1) / 2, 1.6) * 0.7;
    const x = c + ((i - (bins - 1) / 2) * radius * 1.48) / bins;
    for (let d = 0; d < Math.max(2, Math.round(height * 8)); d += 1)
      addDot(frame, { x, y: c + (0.5 - d / 6) * radius * height * 1.45, z: d / 8 }, 0.4, 0.22 + d * 0.08, 316 - i * 9);
  }
  return frame;
}

/** Builds `aggregating`: distributed values spiral into a central aggregate. */
export function aggregateFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(18, Math.round(34 * density));
  for (let i = 0; i < count; i += 1) {
    const p = (time * 0.22 + i / count) % 1;
    const a = i * 2.4 + time;
    const r = radius * (0.72 - p * 0.56);
    addDot(
      frame,
      { x: c + Math.cos(a + p * 4) * r, y: c + Math.sin(a + p * 4) * r, z: 1 - p },
      0.28 + (1 - p) * 0.72,
      0.14 + (1 - p) * 0.72,
      162,
    );
  }
  addDot(frame, { x: c, y: c, z: 1 }, 1.25, 0.92, 162);
  return frame;
}

/** Builds `scrubbing`: a timeline playhead scrubs through independently sampled events. */
export function scrubberFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const head = (time * 0.3) % 1;
  const count = Math.max(18, Math.round(34 * density));
  for (let i = 0; i < count; i += 1) {
    const p = i / (count - 1);
    const hot = Math.max(0, 1 - Math.abs(p - head) * 7);
    addDot(
      frame,
      { x: c + (p - 0.5) * radius * 1.6, y: c + Math.sin(i * 2.7) * radius * 0.12, z: hot },
      0.28 + hot * 1.1,
      0.14 + hot * 0.82,
      38,
    );
  }
  const x = c + (head - 0.5) * radius * 1.6;
  addLine(frame, { x, y: c - radius * 0.5, z: 0 }, { x, y: c + radius * 0.5, z: 0 }, 0.16, 0.72, 38);
  return frame;
}

/** Builds `telemetry`: concentric instrument rings broadcast changing readings. */
export function telemetryFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const rings = Math.max(2, Math.min(5, Math.round(2 + density)));
  const samples = Math.max(14, Math.round(22 * density));
  for (let ring = 0; ring < rings; ring += 1)
    for (let i = 0; i < samples; i += 1) {
      const p = i / samples;
      const pulse = Math.max(0, Math.sin(time * 1.2 - p * TAU * 2 - ring));
      const a = p * TAU;
      const r = radius * (0.18 + ring * 0.16);
      addDot(
        frame,
        { x: c + Math.cos(a) * r, y: c + Math.sin(a) * r, z: pulse },
        0.22 + pulse * 0.68,
        0.08 + pulse * 0.76,
        192 + ring * 24,
      );
    }
  return frame;
}

/** Builds `polling`: repeated probes leave a tiny history of successful responses. */
export function pollingFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(8, Math.round(14 * density));
  for (let i = 0; i < count; i += 1) {
    const age = (time * 0.48 + i / count) % 1;
    addDot(
      frame,
      { x: c + (age - 0.5) * radius * 1.54, y: c + Math.sin(age * TAU * 3 + i) * radius * 0.18, z: 1 - age },
      0.32 + (1 - age) * 0.75,
      0.08 + Math.pow(1 - age, 2) * 0.82,
      128,
    );
  }
  return frame;
}

/** Builds `correlating`: two observation axes reveal a pulsing positive correlation. */
export function correlationFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const count = Math.max(18, Math.round(36 * density));
  for (let i = 0; i < count; i += 1) {
    const p = i / (count - 1);
    const noise = Math.sin(i * 8.2 + time * 1.1) * 0.13;
    addDot(
      frame,
      { x: c + (p - 0.5) * radius * 1.48, y: c - ((p - 0.5) * 0.85 + noise) * radius, z: 0.2 },
      0.34,
      0.35 + (i % 4) * 0.1,
      i % 2 ? 206 : 296,
    );
  }
  return frame;
}

/** Builds `routing`: packets choose among a small map of competing routes. */
export function flowmapFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = centerOf(radius);
  const routeCount = Math.max(3, Math.min(7, Math.round(3 * density)));
  const routes = Array.from({ length: routeCount }, (_, route) => ((route / Math.max(1, routeCount - 1)) - 0.5) * 0.76);
  const packets = Math.max(2, Math.round(4 * density));
  routes.forEach((offset, route) => {
    let prev: ProjectedPoint | undefined;
    for (let i = 0; i <= 18; i += 1) {
      const p = i / 18;
      const point = {
        x: c + (p - 0.5) * radius * 1.6,
        y: c + offset * radius + Math.sin(p * TAU + route) * radius * 0.11,
        z: -0.2,
      };
      if (prev) addLine(frame, prev, point, 0.08, 0.24, 174 + route * 28);
      prev = point;
    }
    for (let packet = 0; packet < packets; packet += 1) {
      const p = (time * (0.24 + route * 0.05) + packet / packets) % 1;
      addDot(
        frame,
        { x: c + (p - 0.5) * radius * 1.6, y: c + offset * radius + Math.sin(p * TAU + route) * radius * 0.11, z: 0.8 },
        0.68,
        0.84,
        174 + route * 28,
      );
    }
  });
  return frame;
}
