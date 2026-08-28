import type { FrameContext, OrbFrame } from './shared';
import { addArc, addLine, addRect, createFrame, TAU } from './shared';
import { densityCount, safeThickness } from './shape-metrics';

const centerOf = (radius: number) => radius / 0.82;
const oscillate = (time: number, seed: number, speed = 1) => (Math.sin(time * speed + seed) + 1) / 2;

/** Builds `summarizing`: a segmented donut chart gently redistributes a live total. */
export function donutFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const { time, radius } = context;
  const center = centerOf(radius);
  const segments = densityCount(context, { base: 4, minimum: 3, maximum: 10 });
  const step = TAU / segments;
  const gap = Math.min(0.038, step * 0.06);
  const thickness = safeThickness(context, radius * 0.16, radius * 0.3, radius * 0.05);
  const tones = [18, 44, 194];
  const activeSegment = (time * 0.48) % segments;
  const weights = Array.from({ length: segments }, (_, index) => {
    const distance = Math.min(Math.abs(index - activeSegment), segments - Math.abs(index - activeSegment));
    return 0.72 + Math.max(0, 1 - distance * 0.72) * 0.72;
  });
  const totalWeight = weights.reduce((total, weight) => total + weight, 0);
  let angle = -Math.PI / 2;
  for (let index = 0; index < segments; index += 1) {
    const span = (TAU - gap * segments) * (weights[index] / totalWeight);
    const startAngle = angle + gap / 2;
    addArc(
      frame,
      {
        x: center,
        y: center,
        radius: radius * 0.52,
        startAngle,
        endAngle: startAngle + span,
        width: thickness,
        z: index / segments,
        cap: 'butt',
      },
      0.82,
      tones[index % tones.length],
    );
    angle += span + gap;
  }
  addArc(
    frame,
    { x: center, y: center, radius: radius * 0.52, startAngle: 0, endAngle: TAU, width: thickness, z: -0.8 },
    0.08,
    215,
  );
  return frame;
}

/** Builds `gauging`: a mechanical instrument dial animates segmented readings, a target band, and a peak needle. */
export function gaugeFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const { time, radius } = context;
  const center = centerOf(radius);
  const start = Math.PI * 0.78;
  const sweep = Math.PI * 1.44;
  const value = 0.14 + oscillate(time, 0.2, 0.68) * 0.74;
  const target = 0.62 + oscillate(time, 2.1, 0.24) * 0.16;
  const ticks = densityCount(context, { base: 18, minimum: 12, maximum: 36 });
  const thickness = safeThickness(context, radius * 0.1, radius * 0.25, radius * 0.05);
  const dialY = center + radius * 0.08;
  const segmentStep = sweep / ticks;
  const segmentGap = Math.min(0.025, segmentStep * 0.22);
  for (let tick = 0; tick < ticks; tick += 1) {
    const progress = (tick + 0.5) / ticks;
    const active = Math.max(0, Math.min(1, (value - tick / ticks) * ticks));
    const tone = progress > target ? 18 : progress > target - 0.14 ? 48 : 196;
    addArc(
      frame,
      {
        x: center,
        y: dialY,
        radius: radius * 0.57,
        startAngle: start + tick * segmentStep + segmentGap,
        endAngle: start + (tick + 1) * segmentStep - segmentGap,
        width: thickness,
        z: active,
        cap: 'butt',
      },
      0.1 + active * 0.8,
      tone,
    );
  }
  addArc(frame, { x: center, y: dialY, radius: radius * 0.7, startAngle: start + sweep * (target - 0.07), endAngle: start + sweep * (target + 0.07), width: Math.max(1, thickness * 0.36), z: 0.4, cap: 'butt' }, 0.8, 144);
  for (let tick = 0; tick <= ticks; tick += 1) {
    const angle = start + (tick / ticks) * sweep;
    const outer = radius * 0.72;
    const inner = outer - radius * (tick % 4 === 0 ? 0.09 : 0.052);
    addLine(
      frame,
      { x: center + Math.cos(angle) * inner, y: dialY + Math.sin(angle) * inner, z: -0.1 },
      { x: center + Math.cos(angle) * outer, y: dialY + Math.sin(angle) * outer, z: -0.1 },
      0.34,
      tick % 4 === 0 ? 1.3 : 0.75,
      214,
    );
  }
  const angle = start + sweep * value;
  const needleX = center + Math.cos(angle) * radius * 0.5;
  const needleY = dialY + Math.sin(angle) * radius * 0.5;
  addLine(
    frame,
    { x: center, y: dialY, z: 0.2 },
    { x: needleX, y: needleY, z: 0.9 },
    0.88,
    radius * 0.035,
    42,
  );
  const peakAngle = start + sweep * Math.max(value, target);
  addLine(
    frame,
    { x: center + Math.cos(peakAngle) * radius * 0.49, y: dialY + Math.sin(peakAngle) * radius * 0.49, z: 0.65 },
    { x: center + Math.cos(peakAngle) * radius * 0.74, y: dialY + Math.sin(peakAngle) * radius * 0.74, z: 0.65 },
    0.92,
    1.6,
    48,
  );
  addArc(frame, { x: center, y: dialY, radius: radius * 0.17, startAngle: 0, endAngle: TAU, width: Math.max(1.2, thickness * 0.32), z: 0.8 }, 0.62, 214);
  return frame;
}

/** Builds `funneling`: incoming stages compress toward one completed result. */
export function funnelFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const steps = Math.max(4, Math.round(5 * density));
  const height = (radius * 1.15) / steps;
  for (let step = 0; step < steps; step += 1) {
    const progress = step / Math.max(1, steps - 1);
    const width = radius * (1.36 - progress * 0.76) * (0.9 + oscillate(time, step * 1.31, 0.72) * 0.1);
    const x = center - width / 2;
    const y = center - radius * 0.57 + step * height;
    addRect(frame, { x, y, width, height: height * 0.72, z: progress }, 0.35 + progress * 0.5, 208 - step * 18);
  }
  return frame;
}

/** Builds `treemapping`: a shifting treemap partitions a dashboard into weighted live blocks. */
export function treemapFrame({ time, radius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const left = center - radius * 0.72;
  const top = center - radius * 0.57;
  const width = radius * 1.44;
  const height = radius * 1.14;
  const split = 0.42 + oscillate(time, 0.5, 0.5) * 0.16;
  const leftWidth = width * split;
  const gap = 2;
  addRect(frame, { x: left, y: top, width: leftWidth - gap, height, z: 0.2 }, 0.6, 194);
  const rightX = left + leftWidth + gap;
  const rightWidth = width - leftWidth - gap;
  const upper = 0.4 + oscillate(time, 2.4, 0.7) * 0.23;
  addRect(frame, { x: rightX, y: top, width: rightWidth, height: height * upper - gap, z: 0.45 }, 0.68, 276);
  addRect(
    frame,
    {
      x: rightX,
      y: top + height * upper + gap,
      width: rightWidth * 0.56 - gap,
      height: height * (1 - upper) - gap,
      z: 0.65,
    },
    0.72,
    32,
  );
  addRect(
    frame,
    {
      x: rightX + rightWidth * 0.56 + gap,
      y: top + height * upper + gap,
      width: rightWidth * 0.44 - gap,
      height: height * (1 - upper) - gap,
      z: 0.8,
    },
    0.76,
    152,
  );
  return frame;
}

/** Builds `areamapping`: a continuous area chart rises and falls beneath an animated signal trace. */
export function areaFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(22, Math.round(42 * density));
  const chartWidth = radius * 1.58;
  const baseline = center + radius * 0.52;
  const width = chartWidth / samples;
  let previous: { x: number; y: number; z: number } | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const value =
      0.18 +
      (Math.sin(progress * TAU * 1.55 - time * 1.2) * 0.23 +
        Math.sin(progress * TAU * 3.3 + time * 0.68) * 0.11 +
        0.34);
    const x = center - chartWidth / 2 + index * width;
    const y = baseline - value * radius * 1.35;
    addRect(frame, { x, y, width: width + 0.4, height: baseline - y, z: value }, 0.12 + value * 0.24, 184);
    const point = { x, y, z: value };
    if (previous) addLine(frame, previous, point, 0.8, 0.8, 184);
    previous = point;
  }
  return frame;
}
