import type { FrameContext, OrbFrame } from './shared';
import { addArc, addDot, addLine, addRect, createFrame, TAU } from './shared';
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
  addArc(
    frame,
    {
      x: center,
      y: dialY,
      radius: radius * 0.7,
      startAngle: start + sweep * (target - 0.07),
      endAngle: start + sweep * (target + 0.07),
      width: Math.max(1, thickness * 0.36),
      z: 0.4,
      cap: 'butt',
    },
    0.8,
    144,
  );
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
  addLine(frame, { x: center, y: dialY, z: 0.2 }, { x: needleX, y: needleY, z: 0.9 }, 0.88, radius * 0.035, 42);
  const peakAngle = start + sweep * Math.max(value, target);
  addLine(
    frame,
    { x: center + Math.cos(peakAngle) * radius * 0.49, y: dialY + Math.sin(peakAngle) * radius * 0.49, z: 0.65 },
    { x: center + Math.cos(peakAngle) * radius * 0.74, y: dialY + Math.sin(peakAngle) * radius * 0.74, z: 0.65 },
    0.92,
    1.6,
    48,
  );
  addArc(
    frame,
    {
      x: center,
      y: dialY,
      radius: radius * 0.17,
      startAngle: 0,
      endAngle: TAU,
      width: Math.max(1.2, thickness * 0.32),
      z: 0.8,
    },
    0.62,
    214,
  );
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
export function treemapFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const { time, radius } = context;
  const center = centerOf(radius);
  const left = center - radius * 0.72;
  const top = center - radius * 0.57;
  const width = radius * 1.44;
  const height = radius * 1.14;
  const leaves = densityCount(context, { base: 6, minimum: 4, maximum: 14 });
  const gap = Math.min(2, Math.max(0.6, radius * 0.05));
  const tones = [194, 276, 32, 152, 338, 72];

  const partition = (
    x: number,
    y: number,
    partitionWidth: number,
    partitionHeight: number,
    count: number,
    index: number,
    depth: number,
  ): void => {
    if (count === 1) {
      const inset = Math.min(gap * 0.5, partitionWidth * 0.12, partitionHeight * 0.12);
      addRect(
        frame,
        {
          x: x + inset,
          y: y + inset,
          width: Math.max(0.4, partitionWidth - inset * 2),
          height: Math.max(0.4, partitionHeight - inset * 2),
          z: 0.2 + (index / Math.max(1, leaves)) * 0.68,
        },
        0.56 + oscillate(time, index * 1.43, 0.72) * 0.28,
        tones[index % tones.length],
        index,
      );
      return;
    }

    // A stable uneven split keeps the treemap from resolving into repeated
    // 2×2 groups while still preserving a deterministic topology per density.
    const splitSeed = oscillate(0, index * 2.37 + depth * 1.91 + 1.1);
    const firstCount = Math.max(1, Math.min(count - 1, Math.round(count * (0.36 + splitSeed * 0.24))));
    const secondCount = count - firstCount;
    const preferred = firstCount / count;
    const ratio = Math.min(
      0.68,
      Math.max(0.32, preferred + (oscillate(time, index * 1.19 + depth, 0.42) - 0.5) * 0.16),
    );
    // Keep the partition topology stable while the weighted split breathes.
    // Choosing from the live aspect ratio makes a branch abruptly flip axes
    // when its animated width and height briefly cross over.
    const horizontal = depth % 2 === 0;
    const span = horizontal ? partitionWidth : partitionHeight;
    const splitGap = Math.min(gap, span * 0.16);
    const firstSpan = Math.max(0.4, (span - splitGap) * ratio);
    const secondSpan = Math.max(0.4, span - splitGap - firstSpan);

    if (horizontal) {
      partition(x, y, firstSpan, partitionHeight, firstCount, index, depth + 1);
      partition(x + firstSpan + splitGap, y, secondSpan, partitionHeight, secondCount, index + firstCount, depth + 1);
      return;
    }

    partition(x, y, partitionWidth, firstSpan, firstCount, index, depth + 1);
    partition(x, y + firstSpan + splitGap, partitionWidth, secondSpan, secondCount, index + firstCount, depth + 1);
  };

  partition(left, top, width, height, leaves, 0, 0);
  return frame;
}

/** Builds `bubble-charting`: values share one circular packing field and continuously make room for the current leader. */
export function bubbleChartFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const count = densityCount({ time, radius, density }, { base: 8, minimum: 4, maximum: 12 });
  const sizeMultiplier = particleRadius ?? 1;
  const boundary = radius * 0.68;
  const leader = (time * 0.3) % count;
  const weights = Array.from({ length: count }, (_, index) => {
    const distance = Math.min(Math.abs(index - leader), count - Math.abs(index - leader));
    return 0.48 + Math.max(0, 1 - distance * 0.78) * 1.15;
  });
  const totalWeight = weights.reduce((total, weight) => total + weight, 0);
  const bubbles = weights.map((weight, index) => {
    const angle = index * 2.399963229728653 + time * 0.035;
    const radial = Math.sqrt((index + 0.5) / count) * boundary * 0.66;
    return {
      x: center + Math.cos(angle) * radial,
      y: center + Math.sin(angle) * radial,
      radius: Math.sqrt((weight / totalWeight) * boundary * boundary * 0.62),
      weight,
      tone: [196, 278, 32, 48][index % 4],
    };
  });
  const gap = Math.max(1.1, radius * 0.025);
  for (let pass = 0; pass < 7; pass += 1) {
    for (let left = 0; left < bubbles.length; left += 1) {
      for (let right = left + 1; right < bubbles.length; right += 1) {
        const dx = bubbles[right].x - bubbles[left].x;
        const dy = bubbles[right].y - bubbles[left].y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const minimum = bubbles[left].radius + bubbles[right].radius + gap;
        if (distance >= minimum) continue;
        const shift = ((minimum - distance) / distance) * 0.5;
        const moveX = dx * shift;
        const moveY = dy * shift;
        bubbles[left].x -= moveX;
        bubbles[left].y -= moveY;
        bubbles[right].x += moveX;
        bubbles[right].y += moveY;
      }
    }
    for (const bubble of bubbles) {
      const dx = bubble.x - center;
      const dy = bubble.y - center;
      const distance = Math.hypot(dx, dy) || 0.001;
      const limit = boundary - bubble.radius - gap;
      if (distance > limit) {
        bubble.x = center + (dx / distance) * limit;
        bubble.y = center + (dy / distance) * limit;
      }
    }
  }
  addArc(
    frame,
    { x: center, y: center, radius: boundary, startAngle: 0, endAngle: TAU, width: 0.8, z: -0.8 },
    0.12,
    214,
  );
  const maximumWeight = Math.max(...weights);
  for (const bubble of bubbles) {
    const emphasis = bubble.weight / maximumWeight;
    addDot(
      frame,
      { x: bubble.x, y: bubble.y, z: emphasis },
      bubble.radius / sizeMultiplier,
      0.26 + emphasis * 0.64,
      bubble.tone,
    );
  }
  return frame;
}

/** Builds `areamapping`: a continuous area chart rises and falls beneath an animated signal trace. */
export function areaFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(22, Math.round(42 * density));
  const chartWidth = radius * 1.58;
  const baseline = center + radius * 0.52;
  const step = chartWidth / Math.max(1, samples - 1);
  const barWidth = step + 0.6;
  let previous: { x: number; y: number; z: number } | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const value =
      0.18 +
      (Math.sin(progress * TAU * 1.55 - time * 1.2) * 0.23 +
        Math.sin(progress * TAU * 3.3 + time * 0.68) * 0.11 +
        0.34);
    const x = center - chartWidth / 2 + index * step;
    const y = baseline - value * radius * 1.35;
    addRect(
      frame,
      { x: x - barWidth / 2, y, width: barWidth, height: baseline - y, z: value },
      0.12 + value * 0.24,
      184,
    );
    const point = { x, y, z: value };
    if (previous) addLine(frame, previous, point, 0.8, 0.8, 184);
    previous = point;
  }
  return frame;
}
