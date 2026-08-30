import type { FrameContext, OrbFrame, ProjectedPoint, Vector3 } from './shared';
/* oxlint-disable no-unused-vars -- Shared geometry primitives keep mode modules self-contained. */
import {
  addDot,
  addLine,
  createFrame,
  createProjector,
  depth,
  fibonacciPoint,
  hash,
  lerp,
  normalize,
  smoothstep,
  sphereDots,
  TAU,
} from './shared';

/** Builds the `working` state: layered orbital paths and travelling particles. */
export function orbitFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const project = createProjector({ time, radius, density }, time * 0.18, 0.43);
  const orbitCount = Math.round(7 * density);
  const samples = Math.round(28 * density);

  for (let orbit = 0; orbit < orbitCount; orbit += 1) {
    const tilt = 0.25 + hash(orbit * 2.1) * 1.1;
    const heading = hash(orbit * 1.13) * TAU;
    const ringRadius = 0.44 + hash(orbit * 4.37) * 0.48;
    const normal: Vector3 = [Math.sin(tilt) * Math.cos(heading), Math.cos(tilt), Math.sin(tilt) * Math.sin(heading)];
    const basis: Vector3 = Math.abs(normal[1]) > 0.8 ? [1, 0, 0] : [0, 1, 0];
    const u = normalize([
      normal[1] * basis[2] - normal[2] * basis[1],
      normal[2] * basis[0] - normal[0] * basis[2],
      normal[0] * basis[1] - normal[1] * basis[0],
    ]);
    const v: Vector3 = [
      normal[1] * u[2] - normal[2] * u[1],
      normal[2] * u[0] - normal[0] * u[2],
      normal[0] * u[1] - normal[1] * u[0],
    ];
    const pointAt = (angle: number) =>
      project(
        (u[0] * Math.cos(angle) + v[0] * Math.sin(angle)) * ringRadius,
        (u[1] * Math.cos(angle) + v[1] * Math.sin(angle)) * ringRadius,
        (u[2] * Math.cos(angle) + v[2] * Math.sin(angle)) * ringRadius,
      );

    for (let sample = 0; sample < samples; sample += 1) {
      const point = pointAt((sample / samples) * TAU);
      addDot(frame, point, 0.55, 0.12 + depth(point) * 0.28);
    }
    const travel = time * (0.65 + hash(orbit) * 0.45) * (orbit % 2 ? 1 : -1) + orbit;
    for (let particle = 0; particle < 2; particle += 1) {
      const point = pointAt(travel + particle * Math.PI);
      addDot(frame, point, 1.1 + depth(point) * 1.4, 0.8);
    }
  }
  return frame;
}

/** Builds the `searching` state: a rotating spherical scan highlight. */
export function scanFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(180 * density);
  const project = createProjector(context, time * 0.35, 0.35);
  const scanAngle = time * 1.5;
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const point = project(x, y, z);
    const longitude = Math.atan2(z, x);
    const distance = Math.atan2(Math.sin(longitude - scanAngle), Math.cos(longitude - scanAngle));
    const scan = Math.exp(-(distance * distance) / 0.14) * Math.max(0, point.z);
    addDot(frame, point, 0.45 + depth(point) * 1.55 + scan * 1.5, 0.17 + depth(point) * 0.58 + scan * 0.25);
  }
  return frame;
}

/** Builds the `connecting` state: drifting nodes and their nearest connections. */
export function networkFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(22 * density);
  const project = createProjector(context, time * 0.14, 0.38);
  const nodes: Vector3[] = [];
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    nodes.push(
      normalize([
        x + Math.sin(time * 0.71 + index * 4.1) * 0.09,
        y + Math.sin(time * 0.59 + index * 2.3) * 0.09,
        z + Math.cos(time * 0.67 + index * 3.7) * 0.09,
      ]),
    );
  }
  for (let left = 0; left < count; left += 1) {
    for (let right = left + 1; right < count; right += 1) {
      const distance = Math.hypot(
        nodes[left][0] - nodes[right][0],
        nodes[left][1] - nodes[right][1],
        nodes[left][2] - nodes[right][2],
      );
      if (distance > 0.79) continue;
      const from = project(...nodes[left]);
      const to = project(...nodes[right]);
      addLine(frame, from, to, (1 - distance / 0.79) * (0.1 + ((depth(from) + depth(to)) / 2) * 0.34), 0.45);
    }
  }
  nodes.forEach((node, index) => {
    const point = project(...node);
    addDot(frame, point, 0.7 + depth(point) * 1.65 + Math.sin(time * 1.6 + index) * 0.12, 0.32 + depth(point) * 0.6);
  });
  return frame;
}

/** Builds the `weaving` state: braided strands with alternating depth. */
export function weaveFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.2, 0.32);
  const samples = Math.round(58 * density);
  for (let strand = 0; strand < 3; strand += 1) {
    for (let index = 0; index < samples; index += 1) {
      const latitude = lerp(-0.92, 0.92, index / (samples - 1));
      const band = Math.sqrt(1 - latitude * latitude);
      const angle = latitude * Math.PI * 2.8 + strand * (TAU / 3) + time * 0.55;
      const pulse = 1 + Math.sin(latitude * 19 + strand * 2 + time * 1.2) * 0.065;
      const point = project(Math.cos(angle) * band * pulse, latitude * pulse, Math.sin(angle) * band * pulse);
      addDot(frame, point, 0.65 + depth(point) * 1.7, 0.16 + depth(point) * 0.75);
    }
  }
  return frame;
}

/** Builds the `shaping` state: a continuously interpolating dotted silhouette. */
export function morphFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const phase = (time * 0.22) % 3;
  const from = Math.floor(phase);
  const to = (from + 1) % 3;
  const amount = smoothstep(phase - from);
  const count = Math.round(52 * density);
  const shape = (kind: number, angle: number): [number, number] => {
    if (kind === 0) return [Math.cos(angle), Math.sin(angle)];
    if (kind === 1) {
      const corner = Math.cos(((angle + Math.PI / 2) % (TAU / 3)) - Math.PI / 3);
      const scale = Math.cos(Math.PI / 3) / Math.max(0.22, corner);
      return [Math.cos(angle) * scale, Math.sin(angle) * scale];
    }
    const scale = Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
    return [Math.cos(angle) / scale, Math.sin(angle) / scale];
  };
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TAU - Math.PI / 2;
    const a = shape(from, angle);
    const b = shape(to, angle);
    const breathing = 0.86 + Math.sin(time * 1.3) * 0.035;
    addDot(
      frame,
      {
        x: center + lerp(a[0], b[0], amount) * radius * breathing,
        y: center + lerp(a[1], b[1], amount) * radius * breathing,
        z: 0,
      },
      1.15,
      0.86,
    );
  }
  return frame;
}

/** Builds the `listening` state: a spherical waveform displaced by time. */
export function waveFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(190 * density);
  const project = createProjector(context, time * 0.15, 0.38);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const ripple = 1 + Math.sin(Math.atan2(z, x) * 4 - time * 2.7 + y * 5) * 0.1;
    const point = project(x * ripple, y * ripple, z * ripple);
    const crest = Math.max(0, ripple - 1) * 10;
    addDot(frame, point, 0.45 + depth(point) * 1.55 + crest * 0.45, 0.14 + depth(point) * 0.64 + crest * 0.08);
  }
  return frame;
}

/** Builds the `breathing` state: soft radial rings that expand and fade. */
export function pulseFrame(context: FrameContext): OrbFrame {
  const pulse = 0.89 + (Math.sin(context.time * 2.1) + 1) * 0.045;
  const frame = sphereDots(context, createProjector(context, context.time * 0.09, 0.2), pulse);
  const center = context.radius / 0.82;
  for (let ring = 0; ring < 3; ring += 1) {
    const progress = (context.time * 0.34 + ring / 3) % 1;
    const ringRadius = context.radius * (0.15 + progress * 0.8);
    const alpha = (1 - progress) * 0.24;
    for (let index = 0; index < 36; index += 1) {
      const angle = (index / 36) * TAU;
      addDot(
        frame,
        { x: center + Math.cos(angle) * ringRadius, y: center + Math.sin(angle) * ringRadius, z: -0.15 },
        0.5,
        alpha,
      );
    }
  }
  return frame;
}

/** Builds the `composing` state: a flowing, depth-aware ribbon. */
export function ribbonFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.1, 0.48);
  const lanes = Math.round(5 * density);
  const samples = Math.round(64 * density);
  for (let lane = 0; lane < lanes; lane += 1) {
    const offset = (lane - (lanes - 1) / 2) * 0.11;
    for (let index = 0; index < samples; index += 1) {
      const angle = (index / samples) * TAU;
      const wobble = Math.sin(angle * 3 - time * 1.8 + lane * 0.2) * 0.12 + Math.sin(angle * 5 + time) * 0.05;
      const point = project(Math.cos(angle), Math.sin(angle) * offset + wobble, Math.sin(angle));
      addDot(frame, point, 0.65 + depth(point) * 1.45, 0.22 + depth(point) * 0.68);
    }
  }
  return frame;
}

/** Builds the direct `crystal` geometry: rotating faceted vertices. */
export function crystalFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(150 * density);
  const project = createProjector(context, time * 0.42, 0.5 + Math.sin(time * 0.7) * 0.1);
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const facet = 0.72 + hash(index * 6.7) * 0.28;
    const point = project(x * facet, y * facet, z * facet);
    const snap = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    addDot(frame, point, 0.5 + depth(point) * 1.75, 0.12 + depth(point) * (0.45 + snap * 0.28));
  }
  return frame;
}

/** Builds the `observing` state: a quiet core surrounded by a travelling halo. */
export function haloFrame(context: FrameContext): OrbFrame {
  const frame = sphereDots(context, createProjector(context, context.time * 0.07, 0.28), 0.72);
  const center = context.radius / 0.82;
  const orbitRadius = context.radius * 1.12;
  for (let index = 0; index < 92 * context.density; index += 1) {
    const angle = (index / (92 * context.density)) * TAU + context.time * 0.8;
    const vertical = Math.sin(angle * 2 + context.time) * context.radius * 0.14;
    addDot(
      frame,
      {
        x: center + Math.cos(angle) * orbitRadius,
        y: center + Math.sin(angle) * context.radius * 0.42 + vertical,
        z: Math.sin(angle),
      },
      0.5 + (Math.sin(angle) + 1) * 0.45,
      0.18 + (Math.sin(angle) + 1) * 0.16,
    );
  }
  return frame;
}

/** Rotates a 3D point around axis `0` (x), `1` (y), or `2` (z) by radians. */
function rotateAroundAxis([x, y, z]: Vector3, axis: number, angle: number): Vector3 {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  if (axis === 0) return [x, y * cosine - z * sine, y * sine + z * cosine];
  if (axis === 1) return [x * cosine + z * sine, y, -x * sine + z * cosine];
  return [x * cosine - y * sine, x * sine + y * cosine, z];
}

/** Builds the `solving` state: a ten-move cube sequence across outer, middle and wide layers. */
export function cubeFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, 0.52 + Math.sin(time * 0.17) * 0.16, 0.42 + Math.cos(time * 0.13) * 0.1);
  const divisions = Math.max(4, Math.round(6 * density));
  const moves = [
    { axis: 0, slice: 'positive', angle: Math.PI / 2 },
    { axis: 1, slice: 'negative', angle: -Math.PI },
    { axis: 2, slice: 'middle', angle: Math.PI / 2 },
    { axis: 1, slice: 'positive-wide', angle: Math.PI / 2 },
    { axis: 0, slice: 'negative', angle: -Math.PI / 2 },
    { axis: 2, slice: 'negative-wide', angle: Math.PI },
    { axis: 1, slice: 'middle', angle: -Math.PI / 2 },
    { axis: 2, slice: 'positive', angle: Math.PI / 2 },
    { axis: 0, slice: 'positive-wide', angle: -Math.PI / 2 },
    { axis: 1, slice: 'negative', angle: Math.PI / 2 },
  ] as const;
  const moveDuration = 1.05;
  const activeMoveIndex = Math.floor(time / moveDuration) % moves.length;
  const activeMove = moves[activeMoveIndex];
  const moveProgress = (time % moveDuration) / moveDuration;
  const turn = smoothstep(Math.min(1, moveProgress / 0.72)) * activeMove.angle;
  const faces: Array<{ axis: number; sign: number }> = [
    { axis: 0, sign: -1 },
    { axis: 0, sign: 1 },
    { axis: 1, sign: -1 },
    { axis: 1, sign: 1 },
    { axis: 2, sign: -1 },
    { axis: 2, sign: 1 },
  ];
  for (const face of faces) {
    for (let row = 0; row < divisions; row += 1) {
      for (let column = 0; column < divisions; column += 1) {
        const a = -0.82 + ((row + 0.5) / divisions) * 1.64;
        const b = -0.82 + ((column + 0.5) / divisions) * 1.64;
        const point3: Vector3 =
          face.axis === 0 ? [face.sign, a, b] : face.axis === 1 ? [a, face.sign, b] : [a, b, face.sign];
        const sliceValue = point3[activeMove.axis];
        const belongsToSlice =
          activeMove.slice === 'positive'
            ? sliceValue > 0.48
            : activeMove.slice === 'negative'
              ? sliceValue < -0.48
              : activeMove.slice === 'middle'
                ? Math.abs(sliceValue) < 0.28
                : activeMove.slice === 'positive-wide'
                  ? sliceValue > -0.28
                  : sliceValue < 0.28;
        const [x, y, z] = belongsToSlice ? rotateAroundAxis(point3, activeMove.axis, turn) : point3;
        const point = project(x * 0.72, y * 0.72, z * 0.72);
        const active = belongsToSlice && moveProgress < 0.8;
        addDot(
          frame,
          point,
          0.75 + depth(point) * 1.1 + (active ? 0.4 : 0),
          0.24 + depth(point) * 0.68,
          active ? 36 + activeMove.axis * 76 : undefined,
          active ? activeMoveIndex : null,
        );
      }
    }
  }
  return frame;
}

/** Builds the `dreaming` state: particles moving along a depth tunnel. */
export function tunnelFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const tracks = Math.round(13 * density);
  const particles = Math.round(16 * density);
  for (let track = 0; track < tracks; track += 1) {
    const heading = (track / tracks) * TAU + Math.sin(time * 0.18) * 0.2;
    for (let index = 0; index < particles; index += 1) {
      const progress = (time * 0.3 + index / particles + track * 0.037) % 1;
      const z = progress * 2 - 1;
      const perspective = 0.12 + progress * progress * 1.08;
      const twist = heading + z * 0.72;
      const point = {
        x: center + Math.cos(twist) * radius * perspective,
        y: center + Math.sin(twist) * radius * perspective,
        z,
      };
      addDot(frame, point, 0.35 + progress * progress * 2.4, 0.08 + progress * 0.78);
    }
  }
  return frame;
}

/** Builds the `charging` state: a swarm that gathers and releases energy. */
export function swarmFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(110 * density);
  const project = createProjector(context, 0.1, 0.22);
  for (let index = 0; index < count; index += 1) {
    const direction = fibonacciPoint(index, count);
    const beat = (Math.sin(time * 2.3 + index * 1.7) + 1) / 2;
    const surge = Math.pow(beat, 2.4);
    const spiral = time * 0.55 + index * 0.37;
    const point = project(
      direction[0] * (0.18 + surge * 0.86) + Math.cos(spiral) * 0.08 * (1 - surge),
      direction[1] * (0.18 + surge * 0.86) + Math.sin(spiral * 1.3) * 0.08 * (1 - surge),
      direction[2] * (0.18 + surge * 0.86),
    );
    addDot(frame, point, 0.45 + depth(point) * 1.35 + surge * 0.75, 0.12 + depth(point) * 0.65);
  }
  return frame;
}

/** Builds the `flowing` state: a continuous 3D knot with a travelling signal. */
export function knotFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, 0.35 + Math.sin(time * 0.16) * 0.08, 0.38);
  const count = Math.round(210 * density);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TAU;
    const pulse = 1 + Math.sin(angle * 5 - time * 2.4) * 0.07;
    const x = ((2 + Math.cos(angle * 3)) * Math.cos(angle * 2)) / 3;
    const y = ((2 + Math.cos(angle * 3)) * Math.sin(angle * 2)) / 3;
    const z = Math.sin(angle * 3) / 1.8;
    const point = project(x * pulse, y * pulse, z * pulse);
    const traveller = Math.exp(
      -Math.pow(Math.atan2(Math.sin(angle - time * 1.2), Math.cos(angle - time * 1.2)), 2) / 0.12,
    );
    addDot(frame, point, 0.48 + depth(point) * 1.45 + traveller * 1.2, 0.14 + depth(point) * 0.68 + traveller * 0.18);
  }
  return frame;
}

/** Builds the `singing` state: coloured aurora curtains across a sphere. */
export function auroraFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, 0.18, 0.34);
  const curtains = Math.round(7 * density);
  const samples = Math.round(52 * density);
  for (let curtain = 0; curtain < curtains; curtain += 1) {
    const longitude = (curtain / curtains) * TAU;
    for (let index = 0; index < samples; index += 1) {
      const latitude = lerp(-0.86, 0.86, index / (samples - 1));
      const wave = Math.sin(latitude * 8 - time * 1.4 + curtain * 0.7) * 0.16;
      const radius = Math.sqrt(1 - latitude * latitude) * (0.78 + wave);
      const point = project(Math.cos(longitude + wave) * radius, latitude, Math.sin(longitude + wave) * radius);
      const tone = 160 + curtain * 12 + Math.sin(time + latitude * 5) * 20;
      addDot(frame, point, 0.5 + depth(point) * 1.3, 0.16 + depth(point) * 0.6, tone);
    }
  }
  return frame;
}

/** Builds the `awakening` state: a pulsing radial nova. */
export function novaFrame(context: FrameContext): OrbFrame {
  const { time, radius, density } = context;
  const frame = createFrame();
  const center = radius / 0.82;
  const rays = Math.round(22 * density);
  const particles = Math.round(11 * density);
  const cycle = (time * 0.28) % 1;
  const expansion = cycle < 0.72 ? smoothstep(cycle / 0.72) : 1 - smoothstep((cycle - 0.72) / 0.28);
  for (let ray = 0; ray < rays; ray += 1) {
    const heading = (ray / rays) * TAU + hash(ray) * 0.09;
    for (let index = 0; index < particles; index += 1) {
      const local = (index + hash(ray * 5)) / particles;
      const reach = (0.08 + local * 0.92) * expansion;
      const shimmer = Math.sin(time * 5 + ray * 2.4 + index) * 0.06;
      const point = {
        x: center + Math.cos(heading) * radius * (reach + shimmer),
        y: center + Math.sin(heading) * radius * (reach + shimmer),
        z: reach * 2 - 1,
      };
      addDot(frame, point, 0.45 + reach * 1.8, 0.06 + (1 - local) * 0.7 * expansion, 24 + local * 34);
    }
  }
  return frame;
}

/** Builds the `coding` state: a circuit lattice with alternating live paths. */
export function circuitFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, 0.6, 0.46);
  const divisions = Math.max(3, Math.round(5 * density));
  const nodes: ProjectedPoint[] = [];
  for (let row = -divisions; row <= divisions; row += 1) {
    for (let column = -divisions; column <= divisions; column += 1) {
      const x = row / divisions;
      const y = column / divisions;
      const z = Math.sin(row * 1.7 + column * 0.8) * 0.12;
      nodes.push(project(x * 0.72, y * 0.72, z));
    }
  }
  const width = divisions * 2 + 1;
  for (let index = 0; index < nodes.length; index += 1) {
    const column = index % width;
    if (column < width - 1) addLine(frame, nodes[index], nodes[index + 1], 0.2 + depth(nodes[index]) * 0.25, 0.45, 192);
    if (index + width < nodes.length)
      addLine(frame, nodes[index], nodes[index + width], 0.2 + depth(nodes[index]) * 0.25, 0.45, 192);
    const pulse = (Math.sin(time * 3.4 + index * 1.9) + 1) / 2;
    addDot(frame, nodes[index], 0.55 + pulse * 1.2, 0.2 + pulse * 0.58, 185 + pulse * 55);
  }
  return frame;
}

/** Builds the `transcending` state: layered portal rings in depth. */
export function portalFrame(context: FrameContext): OrbFrame {
  const { time, radius, density } = context;
  const frame = createFrame();
  const center = radius / 0.82;
  const rings = Math.round(7 * density);
  const samples = Math.round(64 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    const phase = (ring / rings + time * 0.16) % 1;
    const baseRadius = radius * (0.12 + phase * 0.96);
    for (let index = 0; index < samples; index += 1) {
      const angle = (index / samples) * TAU + time * (0.4 + ring * 0.03);
      const distortion = 1 + Math.sin(angle * 3 - time * 2 + ring) * 0.12;
      const point = {
        x: center + Math.cos(angle) * baseRadius * distortion,
        y: center + Math.sin(angle) * baseRadius * (0.68 + Math.sin(time * 0.7) * 0.08) * distortion,
        z: phase * 2 - 1,
      };
      addDot(frame, point, 0.4 + phase * 1.45, (1 - phase) * 0.46, 272 + ring * 7);
    }
  }
  return frame;
}

/** Builds the `growing` state: two linked helix strands. */
export function helixFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, 0.18, 0.22);
  const steps = Math.round(72 * density);
  for (let index = 0; index < steps; index += 1) {
    const progress = index / (steps - 1);
    const height = lerp(-0.92, 0.92, progress);
    const angle = height * Math.PI * 5.2 + time * 1.15;
    const radius = Math.sqrt(1 - height * height) * 0.62;
    const left = project(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    const right = project(Math.cos(angle + Math.PI) * radius, height, Math.sin(angle + Math.PI) * radius);
    const tone = 178 + Math.sin(height * 8 + time) * 42;
    addLine(frame, left, right, 0.13 + progress * 0.18, 0.42, tone + 32);
    addDot(frame, left, 0.62 + depth(left) * 1.1, 0.22 + depth(left) * 0.68, tone);
    addDot(frame, right, 0.62 + depth(right) * 1.1, 0.22 + depth(right) * 0.68, tone + 75);
  }
  return frame;
}

/** Builds the `blooming` state: a breathing, colour-shifting petal field. */
export function flowerFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const count = Math.round(220 * density);
  const petals = 5 + Math.floor((Math.sin(time * 0.22) + 1) * 1.5);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * TAU;
    const bloom = 0.38 + Math.abs(Math.sin(angle * petals + time * 0.9)) * 0.66;
    const breathing = 0.9 + Math.sin(time * 1.4) * 0.08;
    const point = {
      x: center + Math.cos(angle) * radius * bloom * breathing,
      y: center + Math.sin(angle) * radius * bloom * breathing,
      z: Math.sin(angle * petals + time) * 0.65,
    };
    addDot(frame, point, 0.46 + ((point.z + 1) / 2) * 1.4, 0.18 + bloom * 0.65, 310 + Math.sin(angle * 2 + time) * 36);
  }
  return frame;
}

/** Builds the `wandering` state: independently wandering, blinking particles. */
export function firefliesFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const count = Math.round(66 * density);
  const project = createProjector(context, 0, 0.1);
  for (let index = 0; index < count; index += 1) {
    const seed = hash(index * 9.3);
    const path = time * (0.32 + seed * 0.24) + index * 1.7;
    const raw: Vector3 = [
      Math.sin(path * 1.7 + seed * 12) * 0.72 + Math.sin(path * 0.43) * 0.16,
      Math.cos(path * 1.21 + index) * 0.66,
      Math.sin(path * 0.91 + index * 2.4) * 0.65,
    ];
    const point = project(...normalize(raw));
    const blink = Math.pow((Math.sin(time * 3.8 + index * 2.13) + 1) / 2, 4);
    addDot(
      frame,
      point,
      0.38 + depth(point) * 1.3 + blink * 2.1,
      0.08 + depth(point) * 0.28 + blink * 0.68,
      48 + blink * 30,
    );
  }
  return frame;
}

/** Builds the `decoding` state: spherical columns of falling data-like particles. */
export function matrixFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const columns = Math.round(16 * density);
  const glyphs = Math.round(20 * density);
  for (let column = 0; column < columns; column += 1) {
    const x = lerp(-0.88, 0.88, column / Math.max(1, columns - 1));
    const wave = Math.sqrt(Math.max(0, 1 - x * x));
    const head = (time * (0.28 + hash(column) * 0.38) + hash(column * 3)) % 1;
    for (let glyph = 0; glyph < glyphs; glyph += 1) {
      const progress = (head - glyph / glyphs + 1) % 1;
      const y = lerp(-wave, wave, progress);
      const z = Math.sqrt(Math.max(0, 1 - x * x - y * y)) * (column % 2 ? 1 : -1);
      const point = { x: center + x * radius, y: center - y * radius, z };
      const trail = 1 - glyph / glyphs;
      addDot(frame, point, 0.4 + trail * 1.35, 0.04 + trail * 0.58, 114 + trail * 35);
    }
  }
  return frame;
}

/** Builds the `calibrating` state: three independently rotating gyroscopic rings. */
export function gyroscopeFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const rings = 3;
  const samples = Math.round(48 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    const tilt = time * (ring % 2 ? -0.72 : 0.62) + (ring * TAU) / rings;
    const project = createProjector(context, tilt, 0.2 + ring * 0.45);
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU;
      const point = project(Math.cos(angle), Math.sin(angle) * Math.cos(tilt), Math.sin(angle) * Math.sin(tilt));
      addDot(frame, point, 0.44 + depth(point) * 1.1, 0.16 + depth(point) * 0.48, 190 + ring * 42);
    }
  }
  const center = context.radius / 0.82;
  addDot(frame, { x: center, y: center, z: 1 }, 3.4, 0.92, 43);
  return frame;
}

/** Builds the `attracting` state: field curves drawn between coloured magnetic poles. */
export function magnetFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const curves = Math.round(18 * density);
  const samples = Math.round(22 * density);
  const pulse = 0.82 + Math.sin(time * 2.4) * 0.09;
  for (let curve = 0; curve < curves; curve += 1) {
    const offset = lerp(-0.9, 0.9, curve / Math.max(1, curves - 1));
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / Math.max(1, samples - 1);
      const x = lerp(-0.76, 0.76, progress);
      const bend = Math.sin(progress * Math.PI) * (0.16 + Math.abs(offset) * 0.78) * (offset < 0 ? -1 : 1);
      const y = offset * 0.7 + bend * pulse;
      const z = Math.cos(progress * Math.PI) * (0.14 + Math.abs(offset) * 0.6);
      const point = { x: center + x * radius, y: center + y * radius, z };
      if (previous) addLine(frame, previous, point, 0.08 + (1 - Math.abs(offset)) * 0.26, 0.45, 205);
      if (sample % 2 === 0) addDot(frame, point, 0.38 + depth(point), 0.22 + depth(point) * 0.4, 205);
      previous = point;
    }
  }
  addDot(frame, { x: center - radius * 0.5, y: center, z: 1 }, 3.1, 0.92, 348);
  addDot(frame, { x: center + radius * 0.5, y: center, z: 1 }, 3.1, 0.92, 198);
  return frame;
}

/** Builds the `shattering` state: triangular shards that separate and reform. */
export function shardsFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.18, 0.42);
  const shardCount = Math.round(13 * density);
  for (let shard = 0; shard < shardCount; shard += 1) {
    const angle = (shard / shardCount) * TAU + time * (0.12 + hash(shard) * 0.08);
    const explode = 0.22 + ((Math.sin(time * 0.82 + shard * 2.7) + 1) / 2) * 0.7;
    const base: Vector3 = [
      Math.cos(angle) * explode,
      Math.sin(angle * 1.7) * explode * 0.72,
      Math.sin(angle) * explode,
    ];
    const points = [
      project(...base),
      project(base[0] + Math.cos(angle + 1.9) * 0.2, base[1] + 0.16, base[2] + Math.sin(angle + 1.9) * 0.2),
      project(base[0] + Math.cos(angle - 1.9) * 0.19, base[1] - 0.16, base[2] + Math.sin(angle - 1.9) * 0.19),
    ];
    addLine(frame, points[0], points[1], 0.35, 0.75, 272);
    addLine(frame, points[1], points[2], 0.3, 0.75, 294);
    addLine(frame, points[2], points[0], 0.35, 0.75, 272);
    for (const point of points) addDot(frame, point, 0.7 + depth(point), 0.38 + depth(point) * 0.42, 274 + shard * 5);
  }
  return frame;
}

/** Builds the `constellating` state: twinkling stars joined to their nearest neighbours. */
export function constellationFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.08, 0.35);
  const count = Math.round(28 * density);
  const points: ProjectedPoint[] = [];
  for (let index = 0; index < count; index += 1) {
    const [x, y, z] = fibonacciPoint(index, count);
    const drift = time * (0.25 + hash(index) * 0.18) + index;
    const point = project(x + Math.sin(drift) * 0.07, y + Math.cos(drift * 1.3) * 0.07, z);
    points.push(point);
    const twinkle = (Math.sin(time * 3.2 + index * 2.17) + 1) / 2;
    addDot(
      frame,
      point,
      0.7 + depth(point) * 1.35 + twinkle * 1.5,
      0.26 + depth(point) * 0.5 + twinkle * 0.24,
      46 + index * 3,
    );
  }
  for (let index = 0; index < points.length; index += 1) {
    let nearest = -1;
    let distance = Number.POSITIVE_INFINITY;
    for (let candidate = index + 1; candidate < points.length; candidate += 1) {
      const dx = points[index].x - points[candidate].x;
      const dy = points[index].y - points[candidate].y;
      const nextDistance = dx * dx + dy * dy;
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = candidate;
      }
    }
    if (nearest >= 0 && distance < context.radius * context.radius * 0.32)
      addLine(frame, points[index], points[nearest], 0.13, 0.55, 206);
  }
  return frame;
}

/** Builds the `folding` state: a moving mesh whose depth follows paper-like folds. */
export function origamiFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.13, 0.46);
  const columns = Math.round(8 * density);
  const rows = Math.round(8 * density);
  const points: ProjectedPoint[][] = [];
  for (let row = 0; row <= rows; row += 1) {
    const line: ProjectedPoint[] = [];
    for (let column = 0; column <= columns; column += 1) {
      const x = lerp(-0.9, 0.9, column / columns);
      const y = lerp(-0.9, 0.9, row / rows);
      const fold = Math.sin((x * 2.6 + y * 1.9) * Math.PI + time * 1.35) * 0.38;
      const point = project(x, y * 0.88, fold);
      line.push(point);
      addDot(frame, point, 0.28 + depth(point) * 0.78, 0.1 + depth(point) * 0.35, 318);
      if (column > 0) addLine(frame, line[column - 1], point, 0.22, 0.45, 318);
      if (row > 0) addLine(frame, points[row - 1][column], point, 0.22, 0.45, 280);
    }
    points.push(line);
  }
  return frame;
}

/** Builds the `echoing` state: expanding concentric rings emitted from a core. */
export function echoFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const rings = 5;
  const samples = Math.round(42 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    const progress = (time * 0.32 + ring / rings) % 1;
    const ringRadius = (0.12 + progress * 0.94) * radius;
    const alpha = (1 - progress) * 0.62;
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU;
      const point = {
        x: center + Math.cos(angle) * ringRadius,
        y: center + Math.sin(angle) * ringRadius,
        z: 1 - progress * 1.4,
      };
      addDot(frame, point, 0.35 + (1 - progress) * 1.1, alpha, 187 + ring * 20);
    }
  }
  return frame;
}

/** Builds the `balancing` state: a pendulum-like kinetic mobile. */
export function mobileFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = radius / 0.82;
  const root = { x: center, y: center - radius * 0.72, z: 0 };
  const arms = Math.round(5 * density);
  for (let arm = 0; arm < arms; arm += 1) {
    const swing = Math.sin(time * (0.75 + arm * 0.12) + arm * 1.8) * 0.52;
    const joint = {
      x: center + Math.sin(swing) * radius * 0.5,
      y: center - radius * 0.32 + arm * radius * 0.12,
      z: Math.cos(swing),
    };
    const bob = {
      x: joint.x + Math.sin(time * 1.2 + arm * 2.2) * radius * 0.22,
      y: joint.y + radius * 0.34,
      z: joint.z + 0.2,
    };
    addLine(frame, root, joint, 0.35, 0.7, 208);
    addLine(frame, joint, bob, 0.56, 0.75, 208 + arm * 20);
    addDot(frame, joint, 1.1, 0.72, 208);
    addDot(frame, bob, 2 + (arm % 2), 0.84, 40 + arm * 45);
  }
  addDot(frame, root, 2.2, 0.9, 210);
  return frame;
}

/** Builds the `weathering` state: multi-arm spirals moving through a wind vortex. */
export function vortexFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.1, 0.35);
  const arms = 5;
  const samples = Math.round(40 * density);
  for (let arm = 0; arm < arms; arm += 1) {
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample < samples; sample += 1) {
      const progress = sample / Math.max(1, samples - 1);
      const angle = arm * (TAU / arms) + time * 1.1 + progress * TAU * 1.5;
      const distance = 0.08 + progress * 0.92;
      const point = project(Math.cos(angle) * distance, (progress - 0.5) * 0.48, Math.sin(angle) * distance);
      addDot(frame, point, 0.34 + depth(point) * 1.15, 0.12 + progress * 0.52, 194 + progress * 85);
      if (previous) addLine(frame, previous, point, 0.14 + progress * 0.16, 0.45, 205);
      previous = point;
    }
  }
  return frame;
}

/** Builds the `mapping` state: rotating latitude lines and a bright travelling route. */
export function atlasFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.18, 0.42);
  const parallels = Math.round(6 * density);
  const samples = Math.round(38 * density);
  for (let line = 0; line < parallels; line += 1) {
    const latitude = lerp(-1.12, 1.12, line / Math.max(1, parallels - 1));
    let previous: ProjectedPoint | undefined;
    for (let sample = 0; sample < samples; sample += 1) {
      const longitude = (sample / samples) * TAU;
      const point = project(
        Math.cos(latitude) * Math.cos(longitude),
        Math.sin(latitude),
        Math.cos(latitude) * Math.sin(longitude),
      );
      if (previous) addLine(frame, previous, point, 0.18, 0.42, 205);
      if (sample % 3 === 0) addDot(frame, point, 0.35 + depth(point), 0.12 + depth(point) * 0.35, 205);
      previous = point;
    }
  }
  const route = project(Math.cos(time * 1.1) * 0.72, Math.sin(time * 0.7) * 0.5, Math.sin(time * 1.1) * 0.72);
  addDot(frame, route, 3.2, 0.96, 36);
  return frame;
}

/** Builds the `forging` state: heated rings with cooling sparks. */
export function forgeFrame(context: FrameContext): OrbFrame {
  const { time, density } = context;
  const frame = createFrame();
  const project = createProjector(context, time * 0.16, 0.45);
  const rings = 4;
  const samples = Math.round(34 * density);
  for (let ring = 0; ring < rings; ring += 1) {
    for (let sample = 0; sample < samples; sample += 1) {
      const angle = (sample / samples) * TAU + time * (0.7 + ring * 0.16);
      const wobble = 0.66 + Math.sin(angle * 3 + time * 2.2 + ring) * 0.12;
      const point = project(Math.cos(angle) * wobble, Math.sin(angle) * wobble, Math.sin(angle * 2 + ring) * 0.22);
      const heat = (Math.sin(time * 4 + sample * 1.7 + ring) + 1) / 2;
      addDot(
        frame,
        point,
        0.45 + depth(point) * 1.2 + heat * 1.1,
        0.16 + depth(point) * 0.38 + heat * 0.3,
        12 + heat * 42,
      );
    }
  }
  const sparks = Math.round(22 * density);
  for (let spark = 0; spark < sparks; spark += 1) {
    const phase = (time * (0.38 + hash(spark) * 0.38) + hash(spark * 5.2)) % 1;
    const angle = hash(spark * 3.3) * TAU;
    const point = project(Math.cos(angle) * phase * 1.25, -phase * 1.1, Math.sin(angle) * phase * 1.25);
    addDot(frame, point, 0.45 + (1 - phase) * 1.5, (1 - phase) * 0.7, 42);
  }
  return frame;
}
