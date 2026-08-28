import type { FrameContext, OrbFrame } from './shared';
import { addLine, addRect, createFrame, smoothstep } from './shared';
import { densityCount, safeThickness } from './shape-metrics';

const centerOf = (radius: number) => radius / 0.82;
const wave = (time: number, index: number, speed: number, phase = 1): number =>
  (Math.sin(time * speed + index * phase) + 1) / 2;

/** Builds `bar-charting`: a real column chart that continuously settles into a new data snapshot. */
export function barChartFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const count = densityCount({ time, radius, density }, { base: 8, minimum: 6, maximum: 16 });
  const chartWidth = radius * 1.58;
  const baseline = center + radius * 0.52;
  const gap = chartWidth / count;
  addLine(
    frame,
    { x: center - chartWidth / 2, y: baseline, z: -0.5 },
    { x: center + chartWidth / 2, y: baseline, z: -0.5 },
    0.18,
    0.45,
    216,
  );
  for (let index = 0; index < count; index += 1) {
    const value = 0.18 + wave(time, index, 1.35, 1.61) * 0.67;
    const height = value * radius * 1.24;
    const width = safeThickness({ time, radius, density, particleRadius }, gap * 0.62, gap, gap * 0.18);
    const x = center - chartWidth / 2 + index * gap + (gap - width) / 2;
    addRect(frame, { x, y: baseline - height, width, height, z: value }, 0.32 + value * 0.62, 198 + index * 8);
    addRect(frame, { x, y: baseline - height - 1.4, width, height: 1.4, z: value + 0.1 }, 0.86, 198 + index * 8);
  }
  return frame;
}

/** Builds `comparing`: paired horizontal bars repeatedly trade the lead in a compact comparison table. */
export function comparisonFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const rows = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  const trackWidth = radius * 1.34;
  const barHeight = safeThickness(
    { time, radius, density, particleRadius },
    radius * 0.105,
    radius * 0.3,
    radius * 0.07,
  );
  for (let row = 0; row < rows; row += 1) {
    const y = center + (row - (rows - 1) / 2) * radius * 0.3;
    const left = 0.24 + wave(time, row, 0.92, 1.77) * 0.56;
    const right = 0.24 + wave(time + 1.2, row, 1.1, 2.43) * 0.56;
    addRect(frame, { x: center - trackWidth / 2, y, width: trackWidth, height: barHeight, z: -0.8 }, 0.08, 220);
    addRect(frame, { x: center - trackWidth / 2, y, width: trackWidth * left, height: barHeight, z: left }, 0.78, 198);
    addRect(
      frame,
      { x: center + trackWidth / 2 - trackWidth * right, y, width: trackWidth * right, height: barHeight, z: right },
      0.78,
      286,
    );
  }
  return frame;
}

/** Builds `accumulating`: stacked segments re-balance themselves while a total steadily grows. */
export function stackedFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const rows = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  const totalWidth = radius * 1.52;
  const rowHeight = safeThickness(
    { time, radius, density, particleRadius },
    radius * 0.15,
    radius * 0.31,
    radius * 0.07,
  );
  const tones = [18, 42, 196, 278];
  for (let row = 0; row < rows; row += 1) {
    const y = center + (row - (rows - 1) / 2) * radius * 0.31;
    let cursor = center - totalWidth / 2;
    for (let segment = 0; segment < 4; segment += 1) {
      const raw = 0.22 + wave(time + row * 0.37, segment + row, 0.7 + segment * 0.11, 1.18) * 0.78;
      const total = 2.65 + Math.sin(time * 0.45 + row) * 0.3;
      const width = (raw / total) * totalWidth;
      addRect(
        frame,
        { x: cursor, y, width: Math.max(1, width - 1.5), height: rowHeight, z: segment * 0.2 },
        0.72,
        tones[segment],
      );
      cursor += width;
    }
  }
  return frame;
}

/** Builds `sequencing`: a timeline of task blocks moves beneath a precise scanning playhead. */
export function timelineFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const lanes = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  const timelineWidth = radius * 1.58;
  const left = center - timelineWidth / 2;
  const head = (time * 0.18) % 1;
  for (let lane = 0; lane < lanes; lane += 1) {
    const y = center + (lane - (lanes - 1) / 2) * radius * 0.27;
    addRect(frame, { x: left, y, width: timelineWidth, height: 1, z: -0.8 }, 0.12, 212);
    for (let block = 0; block < 4; block += 1) {
      const start = (block * 0.29 + lane * 0.13) % 1;
      const width = 0.12 + ((lane + block) % 3) * 0.055;
      const activity = Math.max(0.22, 1 - Math.abs(head - (start + width / 2)) * 3.8);
      addRect(
        frame,
        {
          x: left + start * timelineWidth,
          y: y - radius * 0.045,
          width: width * timelineWidth,
          height: radius * 0.1,
          z: activity,
        },
        0.22 + activity * 0.62,
        176 + lane * 20,
      );
    }
  }
  const x = left + head * timelineWidth;
  addRect(frame, { x: x - 0.65, y: center - radius * 0.58, width: 1.3, height: radius * 1.16, z: 1 }, 0.82, 42);
  return frame;
}

/** Builds `throughput`: packets appear as rectangular payloads and accelerate through a live transport lane. */
export function throughputFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const lanes = densityCount({ time, radius, density }, { base: 3, minimum: 2, maximum: 6 });
  const laneWidth = radius * 1.62;
  const left = center - laneWidth / 2;
  const packets = Math.max(3, Math.round(5 * density));
  for (let lane = 0; lane < lanes; lane += 1) {
    const y = center + (lane - (lanes - 1) / 2) * radius * 0.34;
    addRect(frame, { x: left, y, width: laneWidth, height: radius * 0.11, z: -0.7 }, 0.08, 210);
    for (let packet = 0; packet < packets; packet += 1) {
      const progress = (time * (0.26 + lane * 0.055) + packet / packets + lane * 0.19) % 1;
      const eased = smoothstep(progress);
      const width = radius * (0.085 + ((packet + lane) % 3) * 0.035);
      addRect(
        frame,
        { x: left + eased * (laneWidth - width), y: y - radius * 0.025, width, height: radius * 0.16, z: eased },
        0.32 + eased * 0.58,
        148 + lane * 28,
      );
    }
  }
  return frame;
}
