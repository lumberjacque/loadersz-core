import type { FrameContext, OrbFrame, ProjectedPoint } from './shared';
import { addDot, addLine, createFrame, lerp, TAU } from './shared';

const centerOf = (radius: number) => radius / 0.82;

/** Builds `loading-bars`: seven vertical bars that hand their energy from left to right. */
export function barsFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const bars = 7;
  for (let bar = 0; bar < bars; bar += 1) {
    const phase = (time * 1.55 - bar / bars) * TAU;
    const height = 0.2 + ((Math.sin(phase) + 1) / 2) * 0.74;
    const x = center + (bar - (bars - 1) / 2) * radius * 0.22;
    const dots = Math.max(3, Math.round((4 + height * 6) * density));
    for (let dot = 0; dot < dots; dot += 1) {
      const progress = dot / Math.max(1, dots - 1);
      addDot(
        frame,
        { x, y: center + (0.5 - progress) * radius * height * 1.35, z: progress * 0.7 },
        0.48 + progress * 0.62,
        0.18 + progress * 0.68,
        200 + bar * 11,
      );
    }
  }
  return frame;
}

/** Builds `progressing`: a travelling completion ring with a soft tail and moving endpoint. */
export function progressFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const segments = Math.max(24, Math.round(42 * density));
  const head = (time * 0.42) % 1;
  const length = 0.3 + ((Math.sin(time * 0.58) + 1) / 2) * 0.42;
  for (let index = 0; index < segments; index += 1) {
    const progress = index / segments;
    const distance = (head - progress + 1) % 1;
    if (distance > length) continue;
    const glow = 1 - distance / length;
    const angle = progress * TAU - Math.PI / 2;
    addDot(
      frame,
      { x: center + Math.cos(angle) * radius * 0.66, y: center + Math.sin(angle) * radius * 0.66, z: glow },
      0.34 + glow * 1.16,
      0.08 + glow * 0.86,
      142 + glow * 64,
    );
  }
  return frame;
}

/** Builds `placeholder`: shimmering dotted text lines for skeleton-loading surfaces. */
export function skeletonFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const rows = [1, 0.76, 0.9, 0.5];
  rows.forEach((width, row) => {
    const y = center + (row - 1.5) * radius * 0.29;
    const count = Math.max(10, Math.round(22 * width * density));
    for (let index = 0; index < count; index += 1) {
      const progress = index / Math.max(1, count - 1);
      const shimmer = Math.max(0, Math.cos((progress - time * 0.34 - row * 0.13) * TAU));
      addDot(
        frame,
        { x: center + (progress - 0.5) * radius * width * 1.55, y, z: shimmer * 0.45 - 0.2 },
        0.34 + shimmer * 0.56,
        0.12 + shimmer * 0.5,
        214,
      );
    }
  });
  return frame;
}

/** Builds `monitoring`: a live waveform with a bright sampling head running across it. */
export function waveformFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const samples = Math.max(28, Math.round(68 * density));
  let previous: ProjectedPoint | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const x = center + (progress - 0.5) * radius * 1.6;
    const envelope = 0.26 + Math.sin(progress * Math.PI) * 0.74;
    const y = center + Math.sin(progress * TAU * 2.4 + time * 2.3) * radius * 0.32 * envelope;
    const point = { x, y, z: envelope * 0.45 };
    if (previous) addLine(frame, previous, point, 0.16, 0.28, 178);
    previous = point;
  }
  const head = (time * 0.32) % 1;
  const x = center + (head - 0.5) * radius * 1.6;
  const y = center + Math.sin(head * TAU * 2.4 + time * 2.3) * radius * 0.32 * (0.26 + Math.sin(head * Math.PI) * 0.74);
  addDot(frame, { x, y, z: 0.9 }, 1.52, 0.96, 178);
  return frame;
}

/** Builds `checking`: a matrix of quiet cells with a diagonal verification sweep. */
export function gridFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(4, Math.min(9, Math.round(5 + density * 2)));
  const rows = Math.max(4, Math.min(8, Math.round(4 + density * 2)));
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const phase = (time * 0.48 + (column + row) / (columns + rows)) % 1;
      const pulse = Math.pow(Math.max(0, Math.sin(phase * TAU)), 4);
      addDot(
        frame,
        {
          x: center + (column - (columns - 1) / 2) * ((radius * 1.48) / columns),
          y: center + (row - (rows - 1) / 2) * ((radius * 1.34) / rows),
          z: pulse * 0.9 - 0.3,
        },
        0.42 + pulse * 1.02,
        0.12 + pulse * 0.76,
        104 + row * 7,
      );
    }
  }
  return frame;
}

/** Builds `tracking`: a radar sweep that reveals points around a dotted range ring. */
export function radarFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const segments = Math.max(30, Math.round(56 * density));
  const sweep = time * 1.36;
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * TAU;
    const distance = (sweep - angle + TAU) % TAU;
    const glow = Math.max(0.1, 1 - distance / 1.45);
    addDot(
      frame,
      { x: center + Math.cos(angle) * radius * 0.66, y: center + Math.sin(angle) * radius * 0.66, z: glow - 0.2 },
      0.32 + glow * 0.8,
      0.1 + glow * 0.56,
      164,
    );
  }
  const head = { x: center + Math.cos(sweep) * radius * 0.73, y: center + Math.sin(sweep) * radius * 0.73, z: 0.9 };
  addLine(frame, { x: center, y: center, z: -0.2 }, head, 0.3, 0.7, 164);
  addDot(frame, head, 1.26, 0.96, 164);
  return frame;
}

/** Builds `waiting`: flowing particles pass through a compact hourglass. */
export function hourglassFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const topLeft = { x: center - radius * 0.48, y: center - radius * 0.62, z: -0.1 };
  const topRight = { x: center + radius * 0.48, y: center - radius * 0.62, z: -0.1 };
  const neck = { x: center, y: center, z: 0.5 };
  const bottomLeft = { x: center - radius * 0.48, y: center + radius * 0.62, z: -0.1 };
  const bottomRight = { x: center + radius * 0.48, y: center + radius * 0.62, z: -0.1 };
  addLine(frame, topLeft, neck, 0.16, 0.5, 36);
  addLine(frame, topRight, neck, 0.16, 0.5, 36);
  addLine(frame, neck, bottomLeft, 0.16, 0.5, 36);
  addLine(frame, neck, bottomRight, 0.16, 0.5, 36);
  const grains = Math.max(10, Math.round(22 * density));
  for (let grain = 0; grain < grains; grain += 1) {
    const progress = (time * 0.46 + grain / grains) % 1;
    const upper = progress < 0.5;
    const local = upper ? progress * 2 : (progress - 0.5) * 2;
    const spread = (upper ? 1 - local : local) * radius * 0.38;
    addDot(
      frame,
      {
        x: center + Math.sin(grain * 7.7) * spread,
        y: upper ? lerp(center - radius * 0.5, center, local) : lerp(center, center + radius * 0.5, local),
        z: 0.1 + local * 0.6,
      },
      0.4 + local * 0.62,
      0.22 + local * 0.7,
      36,
    );
  }
  return frame;
}

/** Builds `pulsing`: concentric signal rings expand, fade and immediately renew. */
export function ringsFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const rings = 4;
  const samples = Math.max(18, Math.round(30 * density));
  for (let ring = 0; ring < rings; ring += 1) {
    const progress = (time * 0.42 + ring / rings) % 1;
    const reach = radius * (0.16 + progress * 0.68);
    for (let index = 0; index < samples; index += 1) {
      const angle = (index / samples) * TAU;
      addDot(
        frame,
        { x: center + Math.cos(angle) * reach, y: center + Math.sin(angle) * reach, z: 0.7 - progress },
        0.28 + (1 - progress) * 0.52,
        0.04 + Math.pow(1 - progress, 1.7) * 0.5,
        284,
      );
    }
  }
  addDot(frame, { x: center, y: center, z: 0.9 }, 1.12, 0.82, 284);
  return frame;
}

/** Builds `signaling`: broadcast waves fan outward from a live transmitter. */
export function signalFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const waves = 3;
  const samples = Math.max(12, Math.round(23 * density));
  for (let wave = 0; wave < waves; wave += 1) {
    const progress = (time * 0.64 + wave / waves) % 1;
    const reach = radius * (0.18 + progress * 0.62);
    for (let index = 0; index < samples; index += 1) {
      const angle = -Math.PI / 2 + ((index / (samples - 1)) * Math.PI) / 1.35;
      addDot(
        frame,
        { x: center + Math.cos(angle) * reach, y: center + Math.sin(angle) * reach, z: 0.6 - progress },
        0.3 + (1 - progress) * 0.58,
        0.05 + Math.pow(1 - progress, 1.8) * 0.54,
        322,
      );
    }
  }
  addDot(frame, { x: center, y: center + radius * 0.28, z: 0.9 }, 1.24, 0.92, 322);
  return frame;
}

/** Builds `stepping`: a bright task hops through a five-stage staircase. */
export function stepsFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const count = 5;
  const active = (time * 1.1) % count;
  for (let step = 0; step < count; step += 1) {
    const x = center + (step - (count - 1) / 2) * radius * 0.3;
    const y = center + ((count - 1) / 2 - step) * radius * 0.22;
    const distance = Math.abs(active - step);
    const glow = Math.max(0.16, 1 - distance * 0.72);
    const dots = Math.max(3, Math.round(4 * density));
    for (let dot = 0; dot < dots; dot += 1) {
      addDot(
        frame,
        { x: x + (dot - 1.5) * radius * 0.055, y, z: glow - 0.2 },
        0.4 + glow * 0.8,
        0.13 + glow * 0.76,
        52 + step * 12,
      );
    }
  }
  return frame;
}

/** Builds `streaming`: packets ride three fluid lanes that bend through the canvas. */
export function streamFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const lanes = 3;
  const packets = Math.max(4, Math.round(7 * density));
  for (let lane = 0; lane < lanes; lane += 1) {
    const offset = (lane - 1) * radius * 0.28;
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample <= 26; sample += 1) {
      const progress = sample / 26;
      const point = {
        x: center + (progress - 0.5) * radius * 1.62,
        y: center + offset + Math.sin(progress * TAU + lane * 1.4) * radius * 0.13,
        z: -0.2,
      };
      if (previous) addLine(frame, previous, point, 0.08, 0.2, 192 + lane * 14);
      previous = point;
    }
    for (let packet = 0; packet < packets; packet += 1) {
      const progress = (time * (0.36 + lane * 0.05) + packet / packets) % 1;
      addDot(
        frame,
        {
          x: center + (progress - 0.5) * radius * 1.62,
          y: center + offset + Math.sin(progress * TAU + lane * 1.4) * radius * 0.13,
          z: 0.62,
        },
        0.62,
        0.78,
        192 + lane * 14,
      );
    }
  }
  return frame;
}

/** Builds `equalizing`: compact equalizer bars respond with independent rhythmic heights. */
export function equalizerFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const bars = 9;
  for (let bar = 0; bar < bars; bar += 1) {
    const energy = 0.2 + Math.pow((Math.sin(time * (1.4 + (bar % 3) * 0.22) + bar * 1.7) + 1) / 2, 1.55) * 0.78;
    const count = Math.max(3, Math.round((3 + energy * 8) * density));
    const x = center + (bar - (bars - 1) / 2) * radius * 0.17;
    for (let dot = 0; dot < count; dot += 1) {
      const progress = dot / Math.max(1, count - 1);
      addDot(
        frame,
        { x, y: center + (0.5 - progress) * radius * energy * 1.28, z: progress },
        0.36 + progress * 0.58,
        0.18 + progress * 0.72,
        330 - bar * 8,
      );
    }
  }
  return frame;
}

/** Builds `wiring`: signal packets route around a simple circuit-board trace. */
export function circuitboardFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const routes = [
    [
      { x: -0.68, y: -0.42 },
      { x: -0.12, y: -0.42 },
      { x: -0.12, y: 0.26 },
      { x: 0.64, y: 0.26 },
    ],
    [
      { x: -0.6, y: 0.46 },
      { x: 0.18, y: 0.46 },
      { x: 0.18, y: -0.34 },
      { x: 0.68, y: -0.34 },
    ],
    [
      { x: -0.7, y: 0.02 },
      { x: 0.02, y: 0.02 },
      { x: 0.02, y: 0.62 },
    ],
  ];
  routes.forEach((route, routeIndex) => {
    const points = route.map(({ x, y }) => ({ x: center + x * radius, y: center + y * radius, z: -0.1 }));
    for (let index = 1; index < points.length; index += 1)
      addLine(frame, points[index - 1], points[index], 0.12, 0.3, 156 + routeIndex * 22);
    points.forEach((point) => addDot(frame, point, 0.62, 0.42, 156 + routeIndex * 22));
    const packets = Math.max(1, Math.min(5, Math.round(density * 2)));
    for (let packet = 0; packet < packets; packet += 1) {
      const progress = (time * (0.34 + routeIndex * 0.06) + routeIndex * 0.23 + packet / packets) % 1;
      const segment = Math.min(points.length - 2, Math.floor(progress * (points.length - 1)));
      const local = (progress * (points.length - 1)) % 1;
      addDot(
        frame,
        {
          x: lerp(points[segment].x, points[segment + 1].x, local),
          y: lerp(points[segment].y, points[segment + 1].y, local),
          z: 0.9,
        },
        1.12,
        0.94,
        156 + routeIndex * 22,
      );
    }
  });
  return frame;
}

/** Builds `marqueeing`: a dotted rectangular perimeter with a lively chasing highlight. */
export function marqueeFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const segments = Math.max(28, Math.round(52 * density));
  for (let index = 0; index < segments; index += 1) {
    const progress = index / segments;
    const perimeter = progress * 4;
    const side = Math.floor(perimeter);
    const local = perimeter % 1;
    const halfWidth = radius * 0.72;
    const halfHeight = radius * 0.48;
    const point =
      side === 0
        ? { x: center - halfWidth + local * halfWidth * 2, y: center - halfHeight }
        : side === 1
          ? { x: center + halfWidth, y: center - halfHeight + local * halfHeight * 2 }
          : side === 2
            ? { x: center + halfWidth - local * halfWidth * 2, y: center + halfHeight }
            : { x: center - halfWidth, y: center + halfHeight - local * halfHeight * 2 };
    const distance = (time * 0.62 - progress + 1) % 1;
    const glow = Math.max(0, 1 - distance * 4.4);
    addDot(frame, { ...point, z: glow - 0.2 }, 0.3 + glow * 1.04, 0.12 + glow * 0.8, 18 + glow * 38);
  }
  return frame;
}

/** Builds `orbiting-dots`: three orbital dots trace separate ellipses with faint dotted paths. */
export function orbitdotsFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const orbits = [
    [0.7, 0.3, 0.0, 198],
    [0.52, 0.6, 2.1, 282],
    [0.32, 0.74, 4.2, 42],
  ] as const;
  const samples = Math.max(18, Math.round(34 * density));
  orbits.forEach(([wide, tall, offset, tone]) => {
    for (let index = 0; index < samples; index += 1) {
      const angle = (index / samples) * TAU + offset;
      addDot(
        frame,
        { x: center + Math.cos(angle) * radius * wide, y: center + Math.sin(angle) * radius * tall, z: -0.25 },
        0.24,
        0.14,
        tone,
      );
    }
    const angle = time * 1.16 + offset;
    addDot(
      frame,
      { x: center + Math.cos(angle) * radius * wide, y: center + Math.sin(angle) * radius * tall, z: 0.9 },
      1.1,
      0.94,
      tone,
    );
  });
  addDot(frame, { x: center, y: center, z: 0.2 }, 0.66, 0.52, 198);
  return frame;
}
