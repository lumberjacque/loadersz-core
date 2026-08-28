/* oxlint-disable no-unused-vars -- Shared geometry primitives keep mode modules self-contained. */
import {
  addDot,
  addLine,
  createFrame,
  depth,
  fibonacciPoint,
  hash,
  lerp,
  normalize,
  smoothstep,
  TAU,
  createProjector,
  sphereDots,
} from './shared';
import type { FrameContext, OrbFrame, ProjectedPoint, Vector3 } from './shared';

/** Builds the `orbiting` state: fast satellites with visibly fading orbital trails. */
export function satellitesFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = sphereDots(context, createProjector(context, time * 0.09, 0.35), 0.63);
  const project = createProjector(context, time * 0.12, 0.35);
  const satellites = Math.round(7 * density);
  const trailLength = 15;
  for (let satellite = 0; satellite < satellites; satellite += 1) {
    const speed = 1.25 + hash(satellite) * 1.15;
    const tilt = 0.2 + hash(satellite * 4.1) * 1.1;
    for (let trail = trailLength; trail >= 0; trail -= 1) {
      const age = trail / trailLength;
      const angle = time * speed - age * 0.62 + satellite * 1.9;
      const orbitRadius = 0.76 + hash(satellite * 8.2) * 0.35;
      const point = project(
        Math.cos(angle) * orbitRadius,
        Math.sin(angle) * Math.cos(tilt) * orbitRadius,
        Math.sin(angle) * Math.sin(tilt) * orbitRadius,
      );
      addDot(frame, point, 0.42 + (1 - age) * 1.85 + depth(point), (1 - age) * 0.62, 190 + satellite * 18);
    }
  }
  return frame;
}

/** Builds the `racing` state: three bright comet heads that circle with long, readable tails. */
export function cometFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.16, 0.38);
  const cometCount = 3;
  const tailLength = Math.round(34 * density);
  for (let comet = 0; comet < cometCount; comet += 1) {
    const speed = 1.75 + comet * 0.27;
    for (let tail = tailLength; tail >= 0; tail -= 1) {
      const age = tail / tailLength;
      const phase = time * speed - age * 1.5 + comet * (TAU / cometCount);
      const point = project(
        Math.cos(phase) * (0.7 + Math.sin(phase * 2.1) * 0.16),
        Math.sin(phase * 1.8) * 0.58,
        Math.sin(phase) * (0.7 + Math.sin(phase * 2.1) * 0.16),
      );
      addDot(frame, point, 0.38 + (1 - age) * 2.7 + depth(point), Math.pow(1 - age, 1.8) * 0.78, 24 + comet * 92);
    }
  }
  return frame;
}

/** Builds the `bubbling` state: rising spherical bubbles with independently cycling paths. */
export function bubblesFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const bubbles = Math.round(58 * density);
  for (let bubble = 0; bubble < bubbles; bubble += 1) {
    const seed = hash(bubble * 5.73);
    const cycle = (time * (0.23 + seed * 0.32) + seed) % 1;
    const x = Math.sin(seed * 18 + cycle * 4.8) * (0.18 + seed * 0.66);
    const y = 1.15 - cycle * 2.3;
    const z = Math.cos(seed * 22 + cycle * 3.6) * (0.22 + seed * 0.68);
    const shimmer = (Math.sin(time * 2.7 + bubble * 1.9) + 1) / 2;
    const point = { x: center + x * radius, y: center + y * radius, z };
    addDot(frame, point, 0.45 + seed * 1.5 + shimmer * 0.9, 0.14 + (1 - cycle) * 0.6, 184 + seed * 38);
  }
  return frame;
}

/** Builds the `spinning` state: dense particle blades rotating around a playful central hub. */
export function pinwheelFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const blades = 6;
  const samples = Math.round(29 * density);
  for (let blade = 0; blade < blades; blade += 1) {
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / samples;
      const angle = time * 2.2 + blade * (TAU / blades) + progress * 0.72;
      const distance = 0.1 + progress * 0.94;
      const wobble = Math.sin(time * 3.4 + blade + progress * 7) * 0.08;
      const point = {
        x: center + Math.cos(angle) * (distance + wobble) * radius,
        y: center + Math.sin(angle) * (distance - wobble) * radius,
        z: 1 - progress * 1.25,
      };
      addDot(frame, point, 0.38 + (1 - progress) * 1.45, 0.16 + progress * 0.58, 278 + blade * 14);
    }
  }
  return frame;
}

/** Builds the `electrifying` state: unstable plasma threads with travelling high-energy pulses. */
export function plasmaFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.13, 0.37);
  const threads = Math.round(11 * density);
  const samples = Math.round(28 * density);
  for (let thread = 0; thread < threads; thread += 1) {
    let previous: ProjectedPoint | undefined;
    const phase = thread * 1.37;
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / Math.max(1, samples - 1);
      const angle = progress * TAU + phase;
      const jitter = Math.sin(time * 3.5 + sample * 3.7 + phase) * 0.11;
      const point = project(
        Math.cos(angle) * (0.55 + jitter),
        (progress - 0.5) * 1.55 + Math.sin(time * 1.4 + phase) * 0.12,
        Math.sin(angle) * (0.55 + jitter),
      );
      const pulse = Math.max(0, 1 - Math.abs(((time * 1.25 + thread * 0.17) % 1) - progress) * 7);
      addDot(
        frame,
        point,
        0.35 + depth(point) + pulse * 2.2,
        0.12 + depth(point) * 0.34 + pulse * 0.58,
        184 + pulse * 75,
      );
      if (previous) addLine(frame, previous, point, 0.08 + pulse * 0.38, 0.46 + pulse * 0.5, 212);
      previous = point;
    }
  }
  return frame;
}

/** Builds the `flocking` state: coordinated particles that visibly gather, bank, and spread. */
export function flockFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.08, 0.32);
  const count = Math.round(92 * density);
  for (let bird = 0; bird < count; bird += 1) {
    const seed = hash(bird * 9.7);
    const path = time * (0.9 + seed * 0.5) + seed * TAU;
    const point = project(
      Math.sin(path + Math.sin(path * 0.7) * 0.8) * (0.25 + seed * 0.73),
      Math.cos(path * 1.37 + bird * 0.15) * (0.18 + seed * 0.55),
      Math.cos(path * 0.83 + bird * 0.42) * (0.22 + seed * 0.72),
    );
    const flash = Math.max(0, Math.sin(path * 2.3 + bird) * 0.5 + 0.5);
    addDot(frame, point, 0.42 + depth(point) * 1.2 + flash * 0.8, 0.16 + depth(point) * 0.52, 196 + seed * 34);
  }
  return frame;
}

/** Builds the `throbbing` state: stacked particle waves that repeatedly push out from the centre. */
export function beatsFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const waves = 7;
  const samples = Math.round(44 * density);
  for (let wave = 0; wave < waves; wave += 1) {
    const phase = (time * 0.75 + wave / waves) % 1;
    const ringRadius = (0.08 + phase * 1.03) * radius;
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU;
      const ripple = Math.sin(angle * 6 + time * 6) * radius * 0.045;
      const point = {
        x: center + Math.cos(angle) * (ringRadius + ripple),
        y: center + Math.sin(angle) * (ringRadius + ripple),
        z: 1 - phase * 1.5,
      };
      addDot(frame, point, 0.34 + (1 - phase) * 1.85, Math.pow(1 - phase, 1.45) * 0.74, 326 + wave * 5);
    }
  }
  return frame;
}

/** Builds the `cascading` state: bright droplets continuously falling around a projected globe. */
export function cascadeFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.1, 0.37);
  const streams = Math.round(18 * density);
  const drops = Math.round(15 * density);
  for (let stream = 0; stream < streams; stream += 1) {
    const longitude = (stream / streams) * TAU + time * 0.22;
    for (let drop = 0; drop < drops; drop += 1) {
      const progress = (time * (0.55 + hash(stream) * 0.25) + drop / drops + hash(stream * 6.1)) % 1;
      const y = 1.12 - progress * 2.24;
      const width = Math.sqrt(Math.max(0, 1 - y * y)) * 0.82;
      const point = project(Math.cos(longitude) * width, y, Math.sin(longitude) * width);
      addDot(
        frame,
        point,
        0.34 + depth(point) * 1.2 + (1 - progress) * 0.9,
        0.12 + depth(point) * 0.4 + (1 - progress) * 0.3,
        194,
      );
    }
  }
  return frame;
}

/** Builds the `spiraling` state: a tight moving galaxy with bright cores and winding arms. */
export function galaxyFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.16, 0.38);
  const arms = 5;
  const samples = Math.round(45 * density);
  for (let arm = 0; arm < arms; arm += 1) {
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / samples;
      const angle = arm * (TAU / arms) + progress * TAU * 1.85 - time * (1.2 + progress * 0.7);
      const distance = 0.04 + progress * 1.02;
      const point = project(
        Math.cos(angle) * distance,
        Math.sin(angle * 1.4 + time) * 0.16,
        Math.sin(angle) * distance,
      );
      addDot(
        frame,
        point,
        0.38 + (1 - progress) * 1.7 + depth(point),
        0.16 + (1 - progress) * 0.56,
        36 + progress * 210,
      );
    }
  }
  return frame;
}

/** Builds the `juggling` state: five large kinetic balls trading places on staggered arcs. */
export function juggleFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const balls = Math.max(4, Math.round(5 * density));
  for (let ball = 0; ball < balls; ball += 1) {
    const phase = time * 1.25 + (ball / balls) * TAU;
    const x = Math.sin(phase) * radius * 0.76;
    const y = -Math.abs(Math.cos(phase)) * radius * 0.72 + Math.sin(phase * 2) * radius * 0.12;
    const z = Math.cos(phase) * 0.8;
    const point = { x: center + x, y: center + y, z };
    const trail = 12;
    for (let index = trail; index > 0; index -= 1) {
      const age = index / trail;
      const prior = phase - age * 0.48;
      const trailPoint = {
        x: center + Math.sin(prior) * radius * 0.76,
        y: center - Math.abs(Math.cos(prior)) * radius * 0.72 + Math.sin(prior * 2) * radius * 0.12,
        z: Math.cos(prior) * 0.8,
      };
      addDot(frame, trailPoint, 0.3 + (1 - age) * 1.2, (1 - age) * 0.34, 38 + ball * 56);
    }
    addDot(frame, point, 2.25 + depth(point) * 1.65, 0.94, 38 + ball * 56);
  }
  return frame;
}

/** Builds the `eclipsing` state: two dotted moons pass through a soft orbital alignment. */
export function eclipseFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(118 * density);
  const separation = Math.sin(time * 0.58) * radius * 0.48;
  for (let moon = 0; moon < 2; moon += 1) {
    for (let index = 0; index < count; index += 1) {
      const [x, y, z] = fibonacciPoint(index, count);
      const phase = time * 0.24 + moon * Math.PI;
      const point = {
        x: center + separation * (moon ? 1 : -1) + x * radius * 0.64,
        y: center + y * radius * 0.64 + Math.sin(phase + x * 2.8) * radius * 0.04,
        z: z + (moon ? -0.12 : 0.12),
      };
      const rim = Math.max(0, z) * 0.22;
      addDot(frame, point, 0.42 + depth(point) * 1.35 + rim, 0.12 + depth(point) * 0.5 + rim, moon ? 38 : 214);
    }
  }
  return frame;
}

/** Builds the `resonating` state: phase-shifting interference rings ripple through a core. */
export function resonanceFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const rings = 7;
  const samples = Math.round(44 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    const phase = (time * 0.42 + ring / rings) % 1;
    const ringRadius = radius * (0.12 + phase * 0.98);
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU;
      const ripple = Math.sin(angle * 5 - time * 3.2 + ring * 1.8) * radius * 0.06 * (1 - phase);
      const point = {
        x: center + Math.cos(angle) * (ringRadius + ripple),
        y: center + Math.sin(angle) * (ringRadius + ripple),
        z: 1 - phase * 1.6,
      };
      addDot(frame, point, 0.34 + (1 - phase) * 1.65, Math.pow(1 - phase, 1.6) * 0.72, 275 + ring * 8);
    }
  }
  return frame;
}

/** Builds the `condensing` state: a wide particle field repeatedly collapses into a bright core. */
export function condenseFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(190 * density);
  const phase = (Math.sin(time * 0.78) + 1) / 2;
  const compression = 0.18 + Math.pow(1 - phase, 2.2) * 0.88;
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const twist = time * (0.45 + hash(index) * 0.4);
    const point = {
      x: center + (x * Math.cos(twist) - z * Math.sin(twist)) * radius * compression,
      y: center + y * radius * compression,
      z,
    };
    const glow = 1 - compression;
    addDot(
      frame,
      point,
      0.38 + depth(point) * 1.35 + glow * 1.1,
      0.13 + depth(point) * 0.55 + glow * 0.2,
      28 + glow * 28,
    );
  }
  return frame;
}

/** Builds the `dispersing` state: a compact core breaks into spiralling particles before re-forming. */
export function disperseFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(166 * density);
  const phase = (Math.sin(time * 0.7 - 0.8) + 1) / 2;
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 7.21);
    const angle = seed * TAU + time * (0.5 + seed * 0.9);
    const distance = radius * (0.1 + phase * (0.22 + seed * 0.86));
    const point = {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle * 1.37) * distance * 0.7,
      z: 1 - seed * 1.8,
    };
    const trail = Math.max(0, 1 - Math.abs(seed - phase) * 3.2);
    addDot(frame, point, 0.36 + depth(point) * 1.25 + trail, 0.12 + depth(point) * 0.5 + trail * 0.3, 202 + seed * 60);
  }
  return frame;
}

/** Builds the `prisming` state: a rotating wire prism refracts particles across its faces. */
export function prismFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.42, 0.52);
  const vertices: Vector3[] = [
    [0, -1, 0],
    [-0.86, 0.55, -0.5],
    [0.86, 0.55, -0.5],
    [0, 0.55, 1],
  ];
  const projected = vertices.map((vertex) => project(...vertex));
  for (const [from, to] of [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [2, 3],
    [3, 1],
  ]) {
    addLine(frame, projected[from], projected[to], 0.32, 0.72, 191 + from * 30);
  }
  const count = Math.round(128 * density);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 3.19);
    const face = index % 3;
    const a = hash(index * 8.1);
    const b = hash(index * 4.7) * (1 - a);
    const base = vertices[0];
    const first = vertices[face + 1];
    const second = vertices[((face + 1) % 3) + 1];
    const point = project(
      base[0] * (1 - a - b) + first[0] * a + second[0] * b,
      base[1] * (1 - a - b) + first[1] * a + second[1] * b,
      base[2] * (1 - a - b) + first[2] * a + second[2] * b,
    );
    addDot(frame, point, 0.42 + depth(point) * 1.35, 0.16 + depth(point) * 0.58, 184 + seed * 100);
  }
  return frame;
}

/** Builds the `levitating` state: particle platforms drift upward before dissolving into the field. */
export function levitateFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const platforms = Math.round(9 * density);
  const particles = Math.round(16 * density);
  for (let platform = 0; platform < platforms; platform += 1) {
    const seed = hash(platform * 5.9);
    const progress = (time * (0.22 + seed * 0.18) + seed) % 1;
    const width = radius * (0.16 + seed * 0.36);
    const y = center + radius * (0.92 - progress * 1.85);
    const x = center + Math.sin(time * 0.7 + seed * TAU) * radius * 0.36;
    for (let particle = 0; particle < particles; particle += 1) {
      const horizontal = (particle / Math.max(1, particles - 1) - 0.5) * width * 2;
      const wave = Math.sin(time * 2 + particle * 0.7 + seed * 8) * radius * 0.035;
      const point = { x: x + horizontal, y: y + wave, z: 1 - progress * 1.65 };
      addDot(frame, point, 0.36 + (1 - progress) * 1.15, (1 - progress) * 0.64, 176 + seed * 54);
    }
  }
  return frame;
}

/** Builds the `synchronizing` state: multiple orbital clocks settle into a shared phase. */
export function synchronizeFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.12, 0.4);
  const rings = 4;
  const samples = Math.round(36 * context.density);
  const alignment = (Math.sin(context.time * 0.65) + 1) / 2;
  for (let ring = 0; ring < rings; ring += 1) {
    const tilt = 0.24 + ring * 0.28;
    const offset = (1 - alignment) * ring * 0.94;
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU + context.time * 0.82 + offset;
      const point = project(
        Math.cos(angle) * (0.42 + ring * 0.12),
        Math.sin(angle) * Math.sin(tilt) * (0.42 + ring * 0.12),
        Math.sin(angle) * Math.cos(tilt) * (0.42 + ring * 0.12),
      );
      addDot(frame, point, 0.38 + depth(point) * 1.2, 0.13 + depth(point) * 0.52, 204 + ring * 24);
    }
  }
  return frame;
}

/** Builds the `unraveling` state: a dense helix loosens into long kinetic filaments. */
export function unravelFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.16, 0.38);
  const strands = 5;
  const samples = Math.round(58 * context.density);
  const loosen = (Math.sin(context.time * 0.48) + 1) / 2;
  for (let strand = 0; strand < strands; strand += 1) {
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / Math.max(1, samples - 1);
      const angle = progress * TAU * (2.2 + loosen * 2.8) + strand * (TAU / strands) + context.time * 0.8;
      const radial = 0.16 + progress * (0.26 + loosen * 0.72);
      const point = project(Math.cos(angle) * radial, (progress - 0.5) * 1.6, Math.sin(angle) * radial);
      addDot(frame, point, 0.34 + depth(point) * 1.3, 0.14 + depth(point) * 0.56, 298 + strand * 11);
      if (previous) addLine(frame, previous, point, 0.08 + depth(point) * 0.12, 0.4, 298 + strand * 11);
      previous = point;
    }
  }
  return frame;
}
