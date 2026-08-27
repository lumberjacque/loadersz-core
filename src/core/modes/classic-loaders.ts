import type { FrameContext, OrbFrame } from './shared';
/* oxlint-disable no-unused-vars -- Shared geometry primitives keep mode modules self-contained. */
import { addDot, addLine, createFrame, lerp, TAU } from './shared';

/** Builds the `loading` state: a familiar spinner made from a soft travelling bead trail. */
export function spinnerFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const segments = Math.round(20 * density);
  for (let index = 0; index < segments; index += 1) {
    const progress = index / segments;
    const angle = progress * TAU + time * 3.1;
    const lead = (Math.cos(progress * TAU) + 1) / 2;
    addDot(
      frame,
      {
        x: center + Math.cos(angle) * radius * 0.62,
        y: center + Math.sin(angle) * radius * 0.62,
        z: lead * 1.4 - 0.3,
      },
      0.48 + lead * 1.18,
      0.1 + lead * 0.8,
    );
  }
  return frame;
}

/** Builds the `buffering` state: three staggered rings fill, pause and hand work to one another. */
export function bufferFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const rings = 3;
  const samples = Math.round(24 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    const phase = (time * 0.48 + ring / rings) % 1;
    const reach = radius * (0.27 + ring * 0.2);
    for (let index = 0; index < samples; index += 1) {
      const progress = index / samples;
      const distance = (progress - phase + 1) % 1;
      const glow = Math.max(0, 1 - distance * 3.2);
      if (glow <= 0) continue;
      const angle = progress * TAU - Math.PI / 2;
      addDot(
        frame,
        {
          x: center + Math.cos(angle) * reach,
          y: center + Math.sin(angle) * reach,
          z: ring * 0.22 + glow * 0.65,
        },
        0.34 + glow * 1.1,
        0.08 + glow * 0.78,
      );
    }
  }
  return frame;
}

/** Builds the `typing` state: three patient dots lift in sequence with a small trailing echo. */
export function ellipsisFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const dots = Math.max(3, Math.round(3 * density));
  for (let index = 0; index < dots; index += 1) {
    const phase = (time * 1.55 + index / dots) % 1;
    const lift = Math.pow(Math.sin(phase * Math.PI), 1.9);
    const x = center + (index - (dots - 1) / 2) * radius * 0.48;
    const y = center - lift * radius * 0.34;
    addDot(frame, { x, y, z: lift * 0.9 }, 1.1 + lift * 0.72, 0.28 + lift * 0.68);
    addDot(frame, { x, y: center + radius * 0.4, z: -0.35 }, 0.28 + lift * 0.34, 0.08 + lift * 0.18);
  }
  return frame;
}

/** Builds the `processing` state: work packets travel through a compact, continuously cycling pipeline. */
export function processFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const lanes = 4;
  const packets = Math.round(9 * density);
  for (let lane = 0; lane < lanes; lane += 1) {
    const y = center + (lane - (lanes - 1) / 2) * radius * 0.31;
    const from = { x: center - radius * 0.72, y, z: -0.3 };
    const to = { x: center + radius * 0.72, y, z: -0.3 };
    addLine(frame, from, to, 0.12, 0.32);
    for (let packet = 0; packet < packets; packet += 1) {
      const progress = (time * (0.46 + lane * 0.045) + packet / packets + lane * 0.19) % 1;
      const wave = Math.sin(progress * Math.PI);
      addDot(
        frame,
        { x: lerp(from.x, to.x, progress), y, z: wave * 0.9 - 0.15 },
        0.36 + wave * 1.12,
        0.12 + wave * 0.76,
      );
    }
  }
  return frame;
}
