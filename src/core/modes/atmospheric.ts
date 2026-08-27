import type { FrameContext, OrbFrame, ProjectedPoint, Vector3 } from './shared';
/* oxlint-disable no-unused-vars -- Shared geometry primitives keep mode modules self-contained. */
import { addDot, addLine, createFrame, createProjector, depth, fibonacciPoint, hash, TAU } from './shared';

/** Builds the `glimmering` state: coloured sparks drift through a faceted, living field. */
export function glimmerFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.16, 0.4);
  const count = Math.round(112 * context.density);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 6.31);
    const angle = seed * TAU + context.time * (0.32 + seed);
    const radial = 0.2 + hash(index * 2.7) * 0.83;
    const point = project(
      Math.cos(angle) * radial,
      Math.sin(angle * 1.7 + context.time) * radial * 0.65,
      Math.sin(angle) * radial,
    );
    const flash = Math.pow(Math.max(0, Math.sin(context.time * (1.4 + seed * 2) + index)), 12);
    addDot(
      frame,
      point,
      0.34 + depth(point) * 1.15 + flash * 1.65,
      0.1 + depth(point) * 0.46 + flash * 0.38,
      184 + seed * 130,
    );
  }
  return frame;
}

/** Builds the `radiating` state: a colour-wheel of rays breathes out from a bright centre. */
export function radianceFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const rays = Math.round(30 * density);
  for (let ray = 0; ray < rays; ray += 1) {
    const angle = (ray / rays) * TAU + time * 0.18;
    const tone = (ray / rays) * 360;
    const reach = radius * (0.36 + (Math.sin(time * 1.3 + ray * 0.61) + 1) * 0.29);
    for (let step = 0; step < 9; step += 1) {
      const progress = step / 8;
      const point = {
        x: center + Math.cos(angle) * reach * progress,
        y: center + Math.sin(angle) * reach * progress,
        z: progress * 1.4 - 0.5,
      };
      addDot(frame, point, 0.35 + progress * 0.8, 0.12 + progress * 0.58, tone);
    }
  }
  addDot(frame, { x: center, y: center, z: 1 }, 2, 0.95, (time * 42) % 360);
  return frame;
}

/** Builds the `harmonizing` state: three chromatic oscillators find a shared orbital rhythm. */
export function harmonyFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.13, 0.39);
  const samples = Math.round(54 * context.density);
  for (let voice = 0; voice < 3; voice += 1) {
    let previous: ProjectedPoint | undefined;
    const tone = 36 + voice * 118;
    for (let index = 0; index < samples; index += 1) {
      const progress = index / (samples - 1);
      const angle = progress * TAU * 1.7 + (voice * TAU) / 3 + context.time * 0.72;
      const point = project(Math.cos(angle) * 0.64, Math.sin(angle * 2.1) * 0.27, Math.sin(angle) * 0.54);
      addDot(frame, point, 0.38 + depth(point) * 1.1, 0.16 + depth(point) * 0.5, tone);
      if (previous) addLine(frame, previous, point, 0.12, 0.46, tone);
      previous = point;
    }
  }
  return frame;
}

/** Builds the `twinkling` state: a deep field of stars changes colour as individual points flare. */
export function twinkleFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(138 * density);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 3.41);
    const phase = Math.max(0, Math.sin(time * (0.9 + seed * 2.1) + seed * 17));
    const flash = Math.pow(phase, 18);
    const point = {
      x: center + (hash(index * 8.2) - 0.5) * radius * 1.78,
      y: center + (seed - 0.5) * radius * 1.66,
      z: hash(index * 1.7) * 2 - 1,
    };
    addDot(frame, point, 0.25 + flash * 2.1, 0.07 + flash * 0.85, 202 + seed * 112);
  }
  return frame;
}

/** Builds the `flickering` state: warm coloured embers rise, split and extinguish. */
export function flickerFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(96 * density);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 8.91);
    const progress = (time * (0.22 + seed * 0.34) + seed) % 1;
    const sway = Math.sin(time * 2.8 + seed * 30) * radius * 0.14 * progress;
    const point = {
      x: center + (seed - 0.5) * radius * 1.2 * progress + sway,
      y: center + radius * (0.74 - progress * 1.55),
      z: progress * 1.2 - 0.6,
    };
    addDot(frame, point, 0.28 + (1 - progress) * 1.5, (1 - progress) * 0.72, 18 + progress * 46);
  }
  return frame;
}

/** Builds the `shimmering` state: translucent colour curtains fold across a slowly turning sphere. */
export function shimmerFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.16, 0.35);
  const samples = Math.round(62 * context.density);
  for (let curtain = 0; curtain < 5; curtain += 1)
    for (let index = 0; index < samples; index += 1) {
      const p = index / (samples - 1) - 0.5;
      const angle = (curtain * TAU) / 5 + Math.sin(p * 7 + context.time) * 0.28;
      const width = 0.36 + Math.cos(p * 9 - context.time * 1.3) * 0.09;
      const point = project(Math.cos(angle) * width, p * 1.65, Math.sin(angle) * width);
      addDot(frame, point, 0.34 + depth(point) * 1.1, 0.12 + depth(point) * 0.5, 158 + curtain * 36 + p * 32);
    }
  return frame;
}

/** Builds the `surfacing` state: cool coloured bubbles emerge through a deep circular current. */
export function surfaceFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(76 * density);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 7.23);
    const progress = (time * (0.19 + seed * 0.29) + seed) % 1;
    const angle = seed * TAU + time * 0.48;
    const spread = radius * (0.08 + seed * 0.68);
    const point = {
      x: center + Math.cos(angle) * spread,
      y: center + radius * (0.72 - progress * 1.45),
      z: progress * 1.5 - 0.6,
    };
    const bubble = Math.sin(progress * Math.PI);
    addDot(frame, point, 0.3 + bubble * (0.8 + seed * 0.9), bubble * 0.64, 174 + seed * 58);
  }
  return frame;
}

/** Builds the `vibrating` state: chromatic wave bands interfere and continuously retune each other. */
export function vibrateFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.12, 0.43);
  const bands = 6;
  const samples = Math.round(44 * context.density);
  for (let band = 0; band < bands; band += 1) {
    let previous: ProjectedPoint | undefined;
    const tone = (band / bands) * 360 + context.time * 18;
    for (let index = 0; index < samples; index += 1) {
      const p = index / (samples - 1) - 0.5;
      const point = project(
        p * 1.65,
        Math.sin(p * 11 + context.time * 2 + band) * 0.22,
        (band - 2.5) * 0.16 + Math.cos(p * 8 - context.time) * 0.18,
      );
      addDot(frame, point, 0.32 + depth(point) * 1.05, 0.14 + depth(point) * 0.48, tone);
      if (previous) addLine(frame, previous, point, 0.12, 0.43, tone);
      previous = point;
    }
  }
  return frame;
}

/** Builds the `illuminating` state: a colourful inner lens sends expanding pulses through a shell. */
export function illuminateFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.15, 0.38);
  const count = Math.round(150 * context.density);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const wave = (Math.sin(context.time * 1.7 + Math.atan2(z, x) * 4 + y * 6) + 1) / 2;
    const point = project(x * (0.9 + wave * 0.16), y * (0.9 + wave * 0.16), z * (0.9 + wave * 0.16));
    addDot(
      frame,
      point,
      0.4 + depth(point) * 1.25 + wave * 0.55,
      0.13 + depth(point) * 0.5 + wave * 0.15,
      278 - wave * 110 + y * 24,
    );
  }
  return frame;
}

/** Builds the `sparkling` state: prismatic shards flash around a rotating crystal core. */
export function sparkleFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.28, 0.48);
  const shards = Math.round(42 * context.density);
  for (let shard = 0; shard < shards; shard += 1) {
    const seed = hash(shard * 4.63);
    const angle = seed * TAU + context.time * (0.35 + seed * 0.45);
    const tilt = hash(shard * 2.17) * Math.PI - Math.PI / 2;
    const radial = 0.22 + hash(shard * 9.2) * 0.76;
    const base: Vector3 = [
      Math.cos(angle) * Math.cos(tilt) * radial,
      Math.sin(tilt) * radial,
      Math.sin(angle) * Math.cos(tilt) * radial,
    ];
    const point = project(...base);
    const flare = Math.pow(Math.max(0, Math.sin(context.time * 2.2 + shard * 2.6)), 10);
    addDot(
      frame,
      point,
      0.36 + depth(point) * 1.1 + flare * 1.5,
      0.16 + depth(point) * 0.48 + flare * 0.32,
      34 + seed * 290,
    );
  }
  const core = project(0, 0, 0);
  addDot(frame, core, 1.6, 0.88, (context.time * 50) % 360);
  return frame;
}
