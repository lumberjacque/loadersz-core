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

/** Builds the `pondering` state: a rotating mesh where small ideas travel along possible paths. */
export function latticeFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.16, 0.46);
  const bands = 7;
  const samples = Math.round(28 * context.density);
  for (let band = 0; band < bands; band += 1) {
    const latitude = -0.78 + (band / (bands - 1)) * 1.56;
    const radial = Math.sqrt(1 - latitude * latitude);
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU + latitude * 0.8;
      const point = project(Math.cos(angle) * radial, latitude, Math.sin(angle) * radial);
      addDot(frame, point, 0.36 + depth(point) * 1.16, 0.1 + depth(point) * 0.42);
    }
    const thought = context.time * (0.52 + band * 0.045) + band * 1.43;
    const point = project(Math.cos(thought) * radial, latitude, Math.sin(thought) * radial);
    addDot(frame, point, 1.1 + depth(point) * 1.1, 0.9);
  }
  for (let meridian = 0; meridian < 5; meridian += 1) {
    const heading = meridian * (TAU / 5) + context.time * 0.11;
    for (let sample = 0; sample < samples; sample += 1) {
      const latitude = -0.9 + (sample / (samples - 1)) * 1.8;
      const radial = Math.sqrt(1 - latitude * latitude);
      const point = project(Math.cos(heading) * radial, latitude, Math.sin(heading) * radial);
      addDot(frame, point, 0.32 + depth(point) * 0.96, 0.08 + depth(point) * 0.3);
    }
  }
  return frame;
}

/** Builds the `deducing` state: layered premises send a signal through a changing inference tree. */
export function deduceFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const layers = 4;
  const nodes = Array.from({ length: layers }, (_, layer) => Math.pow(2, layer));
  const position = (layer: number, index: number): ProjectedPoint => {
    const count = nodes[layer];
    const spread = radius * (0.18 + layer * 0.16);
    const sway = Math.sin(time * 0.72 + layer * 1.9) * radius * 0.06;
    return {
      x: center + (index / Math.max(1, count - 1) - 0.5) * spread * 2 + sway,
      y: center - radius * 0.66 + layer * radius * 0.44,
      z: 0.55 - layer * 0.28,
    };
  };
  for (let layer = 0; layer < layers - 1; layer += 1) {
    for (let index = 0; index < nodes[layer]; index += 1) {
      const from = position(layer, index);
      for (const child of [index * 2, index * 2 + 1]) {
        const to = position(layer + 1, child);
        const progress = (time * 0.35 + layer * 0.24 + index * 0.13) % 1;
        addLine(frame, from, to, 0.11 + progress * 0.13, 0.5);
        const signal = {
          x: lerp(from.x, to.x, progress),
          y: lerp(from.y, to.y, progress),
          z: lerp(from.z, to.z, progress),
        };
        addDot(frame, signal, 0.6 + progress * 1.2, 0.28 + progress * 0.62);
      }
    }
  }
  for (let layer = 0; layer < layers; layer += 1) {
    for (let index = 0; index < nodes[layer]; index += 1) {
      const point = position(layer, index);
      const pulse = Math.max(0, Math.sin(time * 1.3 - layer * 0.9 + index * 0.35));
      addDot(frame, point, 1 + pulse * 0.82, 0.42 + pulse * 0.35);
    }
  }
  const ambient = Math.round(22 * density);
  for (let index = 0; index < ambient; index += 1) {
    const seed = hash(index * 4.2);
    const point = {
      x: center + (seed - 0.5) * radius * 1.8,
      y: center + (hash(index * 7.3) - 0.5) * radius * 1.5,
      z: -0.7,
    };
    addDot(frame, point, 0.3, 0.06 + seed * 0.08);
  }
  return frame;
}

/** Builds the `branching` state: a decision tree grows, retracts, then tries another route. */
export function branchFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const growth = (Math.sin(time * 0.52) + 1) / 2;
  // Keep the branching decision tree legible at low density while letting higher detail
  // values add real decision depth rather than only decorative background particles.
  const levels = Math.max(3, Math.min(7, Math.round(3 + density * 2)));
  const drawBranch = (from: ProjectedPoint, angle: number, length: number, depthLevel: number, seed: number): void => {
    if (depthLevel >= levels) return;
    const visible = smoothstep(Math.max(0, Math.min(1, growth * levels - depthLevel)));
    if (visible < 0.02) return;
    const bend = Math.sin(time * 0.8 + seed * 7 + depthLevel) * 0.22;
    const to = {
      x: from.x + Math.cos(angle + bend) * length * visible,
      y: from.y - Math.sin(angle + bend) * length * visible,
      z: 0.5 - depthLevel * 0.22,
    };
    addLine(frame, from, to, 0.13 + visible * 0.18, 0.52);
    addDot(frame, to, 0.48 + visible * 0.92, 0.2 + visible * 0.52);
    const split = 0.46 + hash(seed * 3.7) * 0.18;
    drawBranch(to, angle - split, length * 0.69, depthLevel + 1, seed * 2.1 + 0.3);
    drawBranch(to, angle + split, length * 0.69, depthLevel + 1, seed * 2.1 + 0.9);
  };
  const root = { x: center, y: center + radius * 0.7, z: 0.8 };
  addDot(frame, root, 1.25, 0.86);
  drawBranch(root, Math.PI / 2, radius * 0.48, 0, 0.21);
  const dust = Math.round(32 * density);
  for (let index = 0; index < dust; index += 1) {
    const seed = hash(index * 9.13);
    addDot(
      frame,
      { x: center + (seed - 0.5) * radius * 1.9, y: center + (hash(index * 2.7) - 0.5) * radius * 1.65, z: -0.6 },
      0.28,
      0.045 + seed * 0.075,
    );
  }
  return frame;
}

/** Builds the `focusing` state: scattered rings progressively settle into one sharp aperture. */
export function apertureFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.1, 0.38);
  const focus = (Math.sin(context.time * 0.65) + 1) / 2;
  const rings = 6;
  const samples = Math.round(34 * context.density);
  for (let ring = 0; ring < rings; ring += 1) {
    const radius = 0.18 + ring * 0.13;
    const offset = (1 - focus) * (ring - (rings - 1) / 2) * 0.42;
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU + context.time * (0.3 + ring * 0.03) + offset;
      const point = project(Math.cos(angle) * radius, Math.sin(angle) * radius * (0.3 + focus * 0.7), offset * 0.8);
      addDot(frame, point, 0.34 + depth(point) * 1.12, 0.1 + depth(point) * 0.45 + focus * 0.08);
    }
  }
  const center = project(0, 0, 0.4);
  addDot(frame, center, 0.8 + focus * 1.6, 0.4 + focus * 0.5);
  return frame;
}

/** Builds the `reflecting` state: a field folds over a drifting mirror plane and resolves its symmetry. */
export function mirrorFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.17, 0.43);
  const count = Math.round(68 * context.density);
  const plane = Math.sin(context.time * 0.58) * 0.22;
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 5.17);
    const x = (seed - 0.5) * 1.6;
    const y = (hash(index * 2.31) - 0.5) * 1.35;
    const z = (hash(index * 8.43) - 0.5) * 1.1;
    const drift = Math.sin(context.time * 0.9 + index * 1.7) * 0.06;
    const top = project(x, plane + Math.abs(y) + drift, z);
    const reflection = project(x, plane - Math.abs(y) - drift, z);
    const link = 0.06 + Math.max(0, 0.24 - Math.abs(y)) * 0.35;
    addLine(frame, top, reflection, link, 0.35);
    addDot(frame, top, 0.35 + depth(top) * 1.14, 0.12 + depth(top) * 0.52);
    addDot(frame, reflection, 0.3 + depth(reflection) * 0.9, 0.08 + depth(reflection) * 0.4);
  }
  for (let index = 0; index < 32; index += 1) {
    const x = -0.9 + (index / 31) * 1.8;
    const point = project(x, plane, 0);
    addDot(frame, point, 0.42, 0.17);
  }
  return frame;
}

/** Builds the `weighing` state: two moving point clouds seek equilibrium across a suspended beam. */
export function scalesFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const tilt = Math.sin(time * 0.72) * 0.32;
  const pivot = { x: center, y: center + radius * 0.06, z: 0.7 };
  const left = { x: center - Math.cos(tilt) * radius * 0.67, y: center + Math.sin(tilt) * radius * 0.67, z: 0.25 };
  const right = { x: center + Math.cos(tilt) * radius * 0.67, y: center - Math.sin(tilt) * radius * 0.67, z: 0.25 };
  addLine(frame, left, right, 0.44, 0.8);
  addLine(frame, pivot, { x: center, y: center + radius * 0.52, z: 0.35 }, 0.25, 0.5);
  addDot(frame, pivot, 1.45, 0.82);
  const particles = Math.round(34 * density);
  for (const [weight, direction] of [
    [left, -1],
    [right, 1],
  ] as const) {
    for (let index = 0; index < particles; index += 1) {
      const seed = hash(index * 4.79 + direction * 6.1);
      const angle = seed * TAU + time * (0.22 + seed * 0.18) * direction;
      const spread = radius * (0.08 + hash(index * 8.7) * 0.18);
      const point = {
        x: weight.x + Math.cos(angle) * spread,
        y: weight.y + radius * 0.22 + Math.sin(angle) * spread * 0.58,
        z: weight.z - seed * 0.6,
      };
      addDot(frame, point, 0.34 + (1 - seed) * 0.9, 0.16 + (1 - seed) * 0.45);
    }
  }
  return frame;
}

/** Builds the `recalling` state: faint snapshots return from the distance toward a central thought. */
export function memoryFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.12, 0.35);
  const echoes = 8;
  const samples = Math.round(28 * context.density);
  for (let echo = 0; echo < echoes; echo += 1) {
    const progress = (context.time * 0.22 + echo / echoes) % 1;
    const radial = 0.16 + (1 - progress) * 0.82;
    const alpha = 0.08 + progress * 0.42;
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU + echo * 0.68 - context.time * 0.28;
      const point = project(
        Math.cos(angle) * radial,
        Math.sin(angle * 1.7) * radial * 0.56,
        Math.sin(angle) * radial * 0.35,
      );
      addDot(frame, point, 0.3 + depth(point) * 0.95 + progress * 0.36, alpha * (0.5 + depth(point) * 0.5));
    }
  }
  const core = project(0, 0, 0.32);
  const pulse = (Math.sin(context.time * 1.45) + 1) / 2;
  addDot(frame, core, 0.58 + pulse * 0.36, 0.34 + pulse * 0.3);
  return frame;
}

/** Builds the `tracing` state: one probe draws a persistent, changing route through an invisible volume. */
export function traceFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const samples = Math.round(130 * density);
  const position = (moment: number): ProjectedPoint => ({
    x: center + Math.sin(moment * 1.17) * radius * 0.67,
    y: center + Math.sin(moment * 1.91 + 0.7) * radius * 0.46,
    z: Math.cos(moment * 0.83),
  });
  let previous: ProjectedPoint | undefined;
  for (let index = 0; index < samples; index += 1) {
    const progress = index / Math.max(1, samples - 1);
    const point = position(time - (1 - progress) * 5.2);
    addDot(frame, point, 0.28 + progress * 0.74, 0.035 + progress * 0.5);
    if (previous) addLine(frame, previous, point, 0.025 + progress * 0.22, 0.42);
    previous = point;
  }
  const probe = position(time);
  addDot(frame, probe, 1.7, 0.92);
  return frame;
}

/** Builds the `converging` state: scattered evidence repeatedly settles into an orderly central structure. */
export function convergeFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.12, 0.39);
  const count = Math.round(160 * context.density);
  const settle = smoothstep((Math.sin(context.time * 0.56) + 1) / 2);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const row = index / Math.max(1, count - 1) - 0.5;
    const angle = index * 2.4 + context.time * 0.65;
    const ordered: Vector3 = [Math.cos(angle) * 0.22, row * 1.45, Math.sin(angle) * 0.22];
    const point = project(lerp(x, ordered[0], settle), lerp(y, ordered[1], settle), lerp(z, ordered[2], settle));
    addDot(frame, point, 0.38 + depth(point) * 1.3 + settle * 0.32, 0.13 + depth(point) * 0.56);
  }
  return frame;
}

/** Builds the `questioning` state: a probing signal circles an uncertain boundary in a quiet particle field. */
export function queryFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.18, 0.42);
  const count = Math.round(142 * context.density);
  const probeAngle = context.time * 0.95;
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const longitude = Math.atan2(z, x);
    const distance = Math.atan2(Math.sin(longitude - probeAngle), Math.cos(longitude - probeAngle));
    const uncertainty = Math.exp(-(distance * distance) / 0.2) * (0.3 + (y + 1) * 0.2);
    const point = project(x * (1 + uncertainty * 0.13), y * (1 + uncertainty * 0.13), z * (1 + uncertainty * 0.13));
    addDot(
      frame,
      point,
      0.38 + depth(point) * 1.3 + uncertainty * 1.1,
      0.12 + depth(point) * 0.52 + uncertainty * 0.28,
    );
  }
  const probe = project(Math.cos(probeAngle) * 1.02, Math.sin(context.time * 0.57) * 0.42, Math.sin(probeAngle) * 1.02);
  const core = project(0, 0, 0);
  addLine(frame, core, probe, 0.2, 0.46);
  addDot(frame, probe, 1.8, 0.94);
  addDot(frame, core, 1.05, 0.52);
  return frame;
}

/** Builds the `synthesizing` state: separate candidate paths light up, test a route, then resolve at one thought. */
export function reasonFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.12, 0.36);
  const branches = 5;
  for (let branch = 0; branch < branches; branch += 1) {
    const offset = branch - (branches - 1) / 2;
    const source = project(-0.82, offset * 0.29, Math.sin(branch * 2.4) * 0.24);
    const premise = project(-0.18, offset * 0.42 + Math.sin(context.time * 0.7 + branch) * 0.12, 0.24);
    const conclusion = project(0.72, offset * 0.12, -0.05);
    addLine(frame, source, premise, 0.18, 0.32);
    addLine(frame, premise, conclusion, 0.22, 0.38);
    for (let particle = 0; particle < 4; particle += 1) {
      const progress = (context.time * 0.37 + branch * 0.17 + particle / 4) % 1;
      const from = progress < 0.5 ? source : premise;
      const to = progress < 0.5 ? premise : conclusion;
      const local = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2;
      addDot(
        frame,
        { x: lerp(from.x, to.x, local), y: lerp(from.y, to.y, local), z: lerp(from.z, to.z, local) + 0.28 },
        0.5 + local * 0.92,
        0.25 + local * 0.6,
      );
    }
  }
  const thought = project(0.86, 0, 0.12);
  addDot(frame, thought, 1.7, 0.92);
  return frame;
}

/** Builds the `considering` state: quiet particles orbit three possible centres before returning to balance. */
export function considerFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.1, 0.43, 1.18);
  const shellCount = Math.round(118 * context.density);
  for (let index = 0; index < shellCount; index += 1) {
    const [x, y, z] = fibonacciPoint(index, shellCount);
    const sway = 0.92 + Math.sin(context.time * 0.72 + y * 5) * 0.07;
    const point = project(x * sway, y * sway, z * sway);
    addDot(frame, point, 0.26 + depth(point) * 0.9, 0.07 + depth(point) * 0.28);
  }
  const centres: Vector3[] = [
    [-0.48, -0.24, 0.2],
    [0.46, -0.18, -0.16],
    [0.04, 0.48, 0.28],
  ];
  const count = Math.round(42 * context.density);
  centres.forEach((centre, candidate) => {
    const core = project(...centre);
    addDot(frame, core, 1.12, 0.62);
    for (let index = 0; index < count; index += 1) {
      const seed = hash(index * 5.17 + candidate * 9.3);
      const angle = seed * TAU + context.time * (0.42 + candidate * 0.08);
      const swell = 0.24 + seed * 0.24 + Math.sin(context.time * 0.8 + candidate) * 0.055;
      const point = project(
        centre[0] + Math.cos(angle) * swell,
        centre[1] + Math.sin(angle * 1.7) * swell * 0.7,
        centre[2] + Math.sin(angle) * swell,
      );
      addDot(frame, point, 0.28 + depth(point) * 0.78, 0.1 + depth(point) * 0.42);
    }
  });
  const balance = project(0, 0.02, 0.74);
  addDot(frame, balance, 1.5, 0.78);
  return frame;
}

/** Builds the `uploading` state: packets rise through a clean transmission channel and lock into place. */
export function uploadFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const lanes = 5;
  const packets = Math.round(7 * density);
  const target = { x: center, y: center - radius * 0.68, z: 0.75 };
  for (let lane = 0; lane < lanes; lane += 1) {
    const x = center + (lane - (lanes - 1) / 2) * radius * 0.24;
    addLine(frame, { x, y: center + radius * 0.68, z: -0.5 }, { x, y: center - radius * 0.5, z: 0.2 }, 0.1, 0.25);
    for (let packet = 0; packet < packets; packet += 1) {
      const progress = (time * 0.54 + packet / packets + lane * 0.13) % 1;
      const settle = smoothstep(progress);
      const point = {
        x: lerp(x, target.x, Math.max(0, (progress - 0.74) / 0.26)),
        y: lerp(center + radius * 0.68, center - radius * 0.52, settle),
        z: -0.35 + settle * 1.15,
      };
      addDot(frame, point, 0.34 + settle * 1.15, 0.12 + settle * 0.78);
    }
  }
  addDot(frame, target, 1.55, 0.9);
  return frame;
}

/** Builds the `queuing` state: compact tasks take turns advancing through a looping work queue. */
export function queueFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector({ time, radius, density }, time * 0.14, 0.44, 1.08);
  const lanes = 4;
  const samples = Math.round(34 * density);
  for (let lane = 0; lane < lanes; lane += 1) {
    const tilt = (lane / lanes) * TAU + 0.25;
    let previous: ProjectedPoint | undefined;
    for (let index = 0; index <= samples; index += 1) {
      const progress = index / samples;
      const angle = progress * TAU;
      const point = project(
        Math.cos(angle) * Math.cos(tilt) * 0.86,
        Math.sin(angle) * 0.58,
        Math.cos(angle) * Math.sin(tilt) * 0.86,
      );
      addDot(frame, point, 0.22 + depth(point) * 0.46, 0.055 + depth(point) * 0.19);
      if (previous) addLine(frame, previous, point, 0.09, 0.22);
      previous = point;
    }
    const tasks = Math.max(3, Math.round(5 * density));
    for (let task = 0; task < tasks; task += 1) {
      const progress = (time * (0.3 + lane * 0.035) + task / tasks + lane * 0.12) % 1;
      const angle = progress * TAU;
      const point = project(
        Math.cos(angle) * Math.cos(tilt) * 0.86,
        Math.sin(angle) * 0.58,
        Math.cos(angle) * Math.sin(tilt) * 0.86,
      );
      addDot(frame, point, 0.54 + depth(point) * 1.08, 0.3 + depth(point) * 0.54);
    }
  }
  addDot(frame, project(0, 0, 0.32), 1.45, 0.78);
  return frame;
}

/** Builds the `associating` state: distant ideas form bright links, release them, and form new combinations. */
export function associateFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.15, 0.4, 1.08);
  const nodes = Math.round(44 * context.density);
  const points: ProjectedPoint[] = [];
  for (let index = 0; index < nodes; index += 1) {
    const seed = hash(index * 3.81);
    const angle = seed * TAU + context.time * (0.2 + hash(index * 9.1) * 0.22);
    const latitude = (hash(index * 7.2) - 0.5) * 1.8;
    const radial = 0.26 + hash(index * 1.7) * 0.66;
    const point = project(
      Math.cos(angle) * Math.cos(latitude) * radial,
      Math.sin(latitude) * radial,
      Math.sin(angle) * Math.cos(latitude) * radial,
    );
    points.push(point);
    addDot(frame, point, 0.32 + depth(point) * 1.05, 0.11 + depth(point) * 0.48);
  }
  for (let index = 0; index < points.length; index += 1) {
    const next = points[(index * 7 + 9) % points.length];
    const pulse = (Math.sin(context.time * 1.05 + index * 1.91) + 1) / 2;
    if (pulse > 0.64) addLine(frame, points[index], next, (pulse - 0.64) * 0.9, 0.24 + pulse * 0.3);
  }
  return frame;
}

/** Builds the `evaluating` state: three rotating candidate forms are measured against a steady centre. */
export function evaluateFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.11, 0.41, 1.12);
  const centre = project(0, 0, 0.14);
  const candidates = 3;
  for (let candidate = 0; candidate < candidates; candidate += 1) {
    const heading = (candidate / candidates) * TAU + context.time * 0.34;
    const anchor = project(Math.cos(heading) * 0.67, Math.sin(heading * 1.6) * 0.28, Math.sin(heading) * 0.56);
    addLine(frame, centre, anchor, 0.22, 0.34);
    for (let sample = 0; sample < Math.round(18 * context.density); sample += 1) {
      const local = (sample / 18) * TAU + context.time * (0.9 + candidate * 0.08);
      const point = project(
        Math.cos(heading) * 0.67 + Math.cos(local) * 0.17,
        Math.sin(heading * 1.6) * 0.28 + Math.sin(local) * 0.13,
        Math.sin(heading) * 0.56 + Math.sin(local * 1.8) * 0.13,
      );
      addDot(frame, point, 0.3 + depth(point) * 0.86, 0.1 + depth(point) * 0.42);
    }
    addDot(frame, anchor, 1.02, 0.66);
  }
  addDot(frame, centre, 1.72, 0.92);
  return frame;
}

/** Builds the `reasoning` state: a dense thought sphere sends evidence through shifting internal routes. */
export function cognitionFrame(context: FrameContext): OrbFrame {
  const project = createProjector(context, context.time * 0.16, 0.42, 1.06);
  const frame = createFrame();
  const count = Math.round(170 * context.density);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const point = project(x * 0.96, y * 0.96, z * 0.96);
    addDot(frame, point, 0.45 + depth(point) * 1.4, 0.15 + depth(point) * 0.58);
    const signal = Math.max(0, Math.sin(context.time * 1.28 + index * 0.43));
    if (signal > 0.88) addDot(frame, point, 1.28 + signal, 0.5 + signal * 0.4);
  }
  const routes = 6;
  for (let route = 0; route < routes; route += 1) {
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample <= 32; sample += 1) {
      const progress = sample / 32;
      const angle = progress * TAU + route * 0.87 + context.time * 0.26;
      const point = project(
        Math.cos(angle) * (0.34 + progress * 0.56),
        Math.sin(angle * 2.1 + route) * 0.22,
        Math.sin(angle) * (0.34 + progress * 0.56),
      );
      if (previous) addLine(frame, previous, point, 0.1, 0.22);
      previous = point;
    }
    const signal = (context.time * 0.48 + route / routes) % 1;
    const angle = signal * TAU + route * 0.87 + context.time * 0.26;
    const head = project(
      Math.cos(angle) * (0.34 + signal * 0.56),
      Math.sin(angle * 2.1 + route) * 0.22,
      Math.sin(angle) * (0.34 + signal * 0.56),
    );
    addDot(frame, head, 1.55, 0.92);
    addDot(frame, project(0, 0, 0), 0.7 + signal * 0.42, 0.12 + signal * 0.14);
  }
  const insight = project(0, 0, 0.88);
  addDot(frame, insight, 1.72, 0.94);
  return frame;
}

/** Builds the `exploring` state: a moving probe illuminates one latitude of an otherwise quiet orb. */
export function exploreFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.1, 0.4, 1.08);
  const count = Math.round(168 * context.density);
  const probeAngle = context.time * 0.82;
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const longitude = Math.atan2(z, x);
    const delta = Math.atan2(Math.sin(longitude - probeAngle), Math.cos(longitude - probeAngle));
    const discovery = Math.exp(-(delta * delta) / 0.1) * (0.3 + (y + 1) * 0.35);
    const point = project(x * (1 + discovery * 0.18), y * (1 + discovery * 0.18), z * (1 + discovery * 0.18));
    addDot(frame, point, 0.34 + depth(point) * 1.12 + discovery * 1.05, 0.1 + depth(point) * 0.46 + discovery * 0.34);
  }
  const probe = project(Math.cos(probeAngle), Math.sin(context.time * 0.47) * 0.36, Math.sin(probeAngle));
  addDot(frame, probe, 1.85, 0.96);
  return frame;
}

/** Builds the `linking` state: separate point clusters on a sphere discover brief, bright bridges. */
export function linkFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.13, 0.38, 1.08);
  const count = Math.round(92 * context.density);
  const points: ProjectedPoint[] = [];
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const warp = Math.sin(context.time * 0.68 + y * 6 + index * 0.17) * 0.09;
    const point = project(x * (0.9 + warp), y * (0.9 + warp), z * (0.9 + warp));
    points.push(point);
    addDot(frame, point, 0.3 + depth(point) * 1.03, 0.1 + depth(point) * 0.46);
  }
  for (let index = 0; index < points.length; index += 1) {
    const other = points[(index * 11 + 17) % points.length];
    const connection = Math.max(0, Math.sin(context.time * 1.15 + index * 0.79));
    if (connection > 0.72) addLine(frame, points[index], other, (connection - 0.72) * 1.2, 0.22 + connection * 0.34);
  }
  addDot(frame, project(0, 0, 0.5), 1.48, 0.72);
  return frame;
}

/** Builds the `resolving` state: bright threads weave through an unstable orb until its facets briefly lock together. */
export function resolveFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.17, 0.46, 1.07);
  const count = Math.round(138 * context.density);
  const settle = smoothstep((Math.sin(context.time * 0.58) + 1) / 2);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const max = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    const faceted: Vector3 = [x / max, y / max, z / max];
    const point = project(lerp(x, faceted[0], settle), lerp(y, faceted[1], settle), lerp(z, faceted[2], settle));
    addDot(frame, point, 0.34 + depth(point) * 1.08 + settle * 0.32, 0.1 + depth(point) * 0.48 + settle * 0.14);
  }
  const threads = 5;
  const samples = Math.round(48 * context.density);
  for (let thread = 0; thread < threads; thread += 1) {
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample <= samples; sample += 1) {
      const progress = sample / samples;
      const angle = progress * TAU * 1.25 + thread * (TAU / threads) + context.time * 0.68;
      const radial = 0.72 + Math.sin(progress * TAU * 2 + thread) * 0.18 * (1 - settle);
      const point = project(
        Math.cos(angle) * radial,
        Math.sin(progress * TAU * 2 + thread * 0.8) * 0.38,
        Math.sin(angle) * radial,
      );
      if (previous) addLine(frame, previous, point, 0.13 + settle * 0.12, 0.22 + settle * 0.14);
      previous = point;
    }
    const headProgress = (context.time * 0.21 + thread / threads) % 1;
    const headAngle = headProgress * TAU * 1.25 + thread * (TAU / threads) + context.time * 0.68;
    const head = project(
      Math.cos(headAngle) * 0.72,
      Math.sin(headProgress * TAU * 2 + thread * 0.8) * 0.38,
      Math.sin(headAngle) * 0.72,
    );
    addDot(frame, head, 1.48, 0.9);
  }
  return frame;
}

/** Builds the `imagining` state: one orb rapidly cycles through a sphere, cube, coil and flower-like imagined form. */
export function imagineFrame(context: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector(context, context.time * 0.16, 0.4, 1.08);
  const count = Math.round(154 * context.density);
  const cycle = (context.time * 0.44) % 1;
  const shapeIndex = Math.floor(cycle * 4);
  const blend = smoothstep((cycle * 4) % 1);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const longitude = Math.atan2(z, x);
    const cubeScale = 1 / Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    const shapes: Vector3[] = [
      [x, y, z],
      [x * cubeScale, y * cubeScale, z * cubeScale],
      [Math.cos(longitude * 2) * (0.24 + (y + 1) * 0.18), y * 1.24, Math.sin(longitude * 2) * (0.24 + (y + 1) * 0.18)],
      [Math.cos(longitude * 3) * (0.36 + y * y * 0.25), y * 1.06, Math.sin(longitude * 3) * (0.36 + y * y * 0.25)],
    ];
    const current = shapes[shapeIndex];
    const next = shapes[(shapeIndex + 1) % shapes.length];
    const point = project(
      lerp(current[0], next[0], blend),
      lerp(current[1], next[1], blend),
      lerp(current[2], next[2], blend),
    );
    addDot(frame, point, 0.34 + depth(point) * 1.1 + blend * 0.24, 0.11 + depth(point) * 0.46 + blend * 0.08);
  }
  return frame;
}
