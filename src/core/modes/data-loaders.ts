import type { FrameContext, OrbFrame, ProjectedPoint } from './shared';
import { addDot, addLine, createFrame, TAU } from './shared';

const centerOf = (radius: number) => radius / 0.82;

/** Builds `charting`: a compact live bar chart that redistributes its energy every beat. */
export function chartFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = 11;
  for (let column = 0; column < columns; column += 1) {
    const wave = (Math.sin(time * 1.7 + column * 1.28) + 1) / 2;
    const detail = (Math.sin(time * 0.72 - column * 2.17) + 1) / 2;
    const height = 0.18 + (wave * 0.68 + detail * 0.22) * Math.sin(((column + 1) / (columns + 1)) * Math.PI);
    const dots = Math.max(3, Math.round((3 + height * 9) * density));
    const x = center + (column - (columns - 1) / 2) * radius * 0.145;
    for (let dot = 0; dot < dots; dot += 1) {
      const progress = dot / Math.max(1, dots - 1);
      addDot(
        frame,
        { x, y: center + (0.5 - progress) * radius * height * 1.5, z: progress * 0.65 },
        0.28 + progress * 0.52,
        0.18 + progress * 0.68,
        30 + column * 11,
      );
    }
  }
  return frame;
}

/** Builds `plotting`: a continuous signal line with a travelling cursor and softly sampled history. */
export function plotFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(24, Math.round(58 * density));
  let previous: ProjectedPoint | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const x = center + (progress - 0.5) * radius * 1.58;
    const y =
      center +
      (Math.sin(progress * TAU * 1.42 + time * 1.2) * 0.28 + Math.sin(progress * TAU * 4.1 - time * 1.9) * 0.09) *
        radius;
    const point = { x, y, z: 0.15 + Math.sin(progress * Math.PI) * 0.5 };
    if (previous) addLine(frame, previous, point, 0.13, 0.42, 188);
    if (index % 3 === 0) addDot(frame, point, 0.3, 0.28, 188);
    previous = point;
  }
  const head = (time * 0.22) % 1;
  const headX = center + (head - 0.5) * radius * 1.58;
  const headY =
    center +
    (Math.sin(head * TAU * 1.42 + time * 1.2) * 0.28 + Math.sin(head * TAU * 4.1 - time * 1.9) * 0.09) * radius;
  addLine(
    frame,
    { x: headX, y: center + radius * 0.62, z: -0.3 },
    { x: headX, y: center - radius * 0.62, z: -0.3 },
    0.08,
    0.28,
    188,
  );
  addDot(frame, { x: headX, y: headY, z: 0.95 }, 1.3, 0.98, 188);
  return frame;
}

/** Builds `sampling`: a moving scatter plot that collects bright observations around a trend. */
export function scatterFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(20, Math.round(42 * density));
  for (let index = 0; index < samples; index += 1) {
    const progress = index / Math.max(1, samples - 1);
    const drift = time * 0.18 + index * 0.47;
    const x = center + (progress - 0.5) * radius * 1.48 + Math.sin(drift * 2.1) * radius * 0.055;
    const trend = -0.35 + progress * 0.7;
    const spread = Math.sin(index * 8.37 + time * 1.35) * 0.19 + Math.sin(index * 2.11 - time) * 0.075;
    const pulse = (Math.sin(time * 2.2 + index * 1.4) + 1) / 2;
    addDot(
      frame,
      { x, y: center - (trend + spread) * radius, z: pulse * 0.72 - 0.1 },
      0.3 + pulse * 0.62,
      0.2 + pulse * 0.64,
      286 + (index % 3) * 16,
    );
  }
  return frame;
}

/** Builds `forecasting`: observed data becomes a dotted projection that grows into the future. */
export function forecastFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(28, Math.round(56 * density));
  let previous: ProjectedPoint | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const observed = progress < 0.55;
    const local = observed ? progress / 0.55 : (progress - 0.55) / 0.45;
    const x = center + (progress - 0.5) * radius * 1.6;
    const y = observed
      ? center + Math.sin(local * TAU * 0.95 + time * 1.05) * radius * 0.27
      : center +
        (Math.sin(TAU * 0.95 + time * 1.05) * 0.27 + local * local * 0.22 + Math.sin(local * 5 + time) * 0.045) *
          radius;
    const point = { x, y, z: observed ? 0.46 : 0.12 + local * 0.2 };
    if (previous && observed) addLine(frame, previous, point, 0.15, 0.52, 154);
    if (!observed || index % 2 === 0)
      addDot(
        frame,
        point,
        observed ? 0.36 : 0.28 + local * 0.22,
        observed ? 0.54 : 0.16 + local * 0.36,
        observed ? 154 : 42,
      );
    previous = point;
  }
  const boundary = center + (0.55 - 0.5) * radius * 1.6;
  addDot(frame, { x: boundary, y: center, z: 0.84 }, 0.84, 0.82, 154);
  return frame;
}

/** Builds `metering`: a segmented dial whose measure and peak indicator continuously update. */
export function meterFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const segments = Math.max(24, Math.round(42 * density));
  const value = 0.34 + ((Math.sin(time * 1.05) + 1) / 2) * 0.56;
  const start = Math.PI * 0.78;
  const sweep = Math.PI * 1.44;
  for (let index = 0; index < segments; index += 1) {
    const progress = index / (segments - 1);
    const angle = start + progress * sweep;
    const active = progress <= value;
    const distance = Math.abs(progress - value);
    const glow = active ? 0.35 + Math.min(0.65, 1 - distance * 8) : 0.1;
    addDot(
      frame,
      { x: center + Math.cos(angle) * radius * 0.67, y: center + Math.sin(angle) * radius * 0.67, z: glow - 0.25 },
      0.31 + glow * 0.76,
      0.08 + glow * 0.82,
      active ? 112 + progress * 68 : 210,
    );
  }
  const angle = start + value * sweep;
  const needle = { x: center + Math.cos(angle) * radius * 0.5, y: center + Math.sin(angle) * radius * 0.5, z: 0.9 };
  addLine(frame, { x: center, y: center, z: 0 }, needle, 0.32, 0.78, 166);
  addDot(frame, { x: center, y: center, z: 0.92 }, 1.1, 0.96, 166);
  addDot(frame, needle, 0.72, 0.92, 166);
  return frame;
}
