import { addDot, addRect, createFrame } from './shared';
import type { FrameContext, OrbFrame } from './shared';

const centerOf = (radius: number) => radius / 0.82;

/** Builds `image-decoding`: encoded pixel blocks resolve in a diagonal wave into a readable image. */
export function imageDecodeFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(9 * density));
  const rows = Math.max(6, Math.round(7 * density));
  const scan = (time * 0.27) % 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = center + (column / Math.max(1, columns - 1) - 0.5) * radius * 1.45;
      const y = center + (row / Math.max(1, rows - 1) - 0.5) * radius * 1.18;
      const progress = (row / rows) * 0.42 + (column / columns) * 0.58;
      const decoded = Math.max(0, 1 - Math.abs(progress - scan) * 4.8);
      const image = (Math.sin(column * 1.82 + row * 0.74) + Math.cos(row * 1.33 - column * 0.48) + 2) / 4;
      addDot(
        frame,
        { x, y, z: decoded },
        0.3 + image * 0.58 + decoded * 0.42,
        0.12 + image * 0.34 + decoded * 0.5,
        194 + image * 86,
      );
    }
  }
  return frame;
}

/** Builds `unblurring`: a diffuse image tightens from its edges into a crisp central signal. */
export function unblurFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(9 * density));
  const rows = Math.max(7, Math.round(9 * density));
  const focus = (Math.sin(time * 0.72) + 1) / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = column / Math.max(1, columns - 1) - 0.5;
      const ny = row / Math.max(1, rows - 1) - 0.5;
      const distance = Math.min(1, Math.hypot(nx, ny) * 2);
      const blur = (1 - focus) * distance;
      const x = center + (nx + Math.sin(row * 2.3 + time * 2) * blur * 0.12) * radius * 1.52;
      const y = center + (ny + Math.cos(column * 1.9 - time * 2) * blur * 0.12) * radius * 1.52;
      const sharpness = 1 - blur;
      addDot(frame, { x, y, z: sharpness }, 0.24 + sharpness * 0.82, 0.09 + sharpness * 0.74, 216 - sharpness * 72);
    }
  }
  addDot(frame, { x: center, y: center, z: 0.96 }, 1.52 + focus * 0.5, 0.9, 144);
  return frame;
}

/** Builds `rendering`: small tiles fill a frame in progressive passes, with the active pass glowing. */
export function renderFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(10 * density));
  const rows = Math.max(6, Math.round(8 * density));
  const progress = (time * 0.23) % 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const order = (row * columns + column) / (rows * columns);
      const completed = order < progress;
      const edge = Math.max(0, 1 - Math.abs(order - progress) * rows * 1.4);
      const x = center + (column / Math.max(1, columns - 1) - 0.5) * radius * 1.46;
      const y = center + (row / Math.max(1, rows - 1) - 0.5) * radius * 1.2;
      const tone = completed ? 166 : 222;
      addDot(
        frame,
        { x, y, z: completed ? 0.48 : -0.12 },
        0.3 + edge * 0.72,
        completed ? 0.2 + edge * 0.66 : 0.07,
        tone,
      );
    }
  }
  return frame;
}

/** Builds `denoising`: noisy pixels settle behind a softly drifting clean field. */
export function denoiseFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(6, Math.round(8 * density));
  const rows = Math.max(6, Math.round(8 * density));
  const calm = (Math.sin(time * 0.74) + 1) / 2;
  const step = (radius * 1.42) / columns;
  const focusX = Math.sin(time * 0.38) * 0.22;
  const focusY = Math.cos(time * 0.31) * 0.18;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = column / Math.max(1, columns - 1) - 0.5;
      const ny = row / Math.max(1, rows - 1) - 0.5;
      const cleared = Math.max(0, 1 - Math.hypot(nx - focusX, ny - focusY) * 3.2);
      const residue = (1 - calm) * (1 - cleared * 0.8);
      const noise = residue * Math.sin(column * 5.3 + row * 2.1 + time * 2.4) * step * 0.26;
      const x = center + (column - columns / 2) * step + noise;
      const y =
        center + (row - rows / 2) * step + Math.cos(column * 2.4 - row * 4.1 + time * 2.2) * residue * step * 0.26;
      addRect(
        frame,
        { x, y, width: step * (0.58 + cleared * 0.16), height: step * (0.58 + cleared * 0.16), z: calm + cleared },
        0.1 + calm * 0.46 + cleared * 0.38,
        cleared > 0.56 ? 168 : 204,
      );
    }
  }
  addDot(frame, { x: center + focusX * radius * 1.42, y: center + focusY * radius * 1.42, z: 1 }, 1.1, 0.86, 154);
  return frame;
}

/** Builds `upscaling`: coarse samples bloom into a crisp, continuous sub-pixel field. */
export function upscaleFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(6, Math.round(8 * density));
  const rows = Math.max(6, Math.round(8 * density));
  const detail = (Math.sin(time * 0.62) + 1) / 2;
  const step = (radius * 1.44) / columns;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = center + (column - columns / 2) * step;
      const y = center + (row - rows / 2) * step;
      addDot(frame, { x, y, z: 0 }, 0.62 + (1 - detail) * 0.72, 0.18 + (1 - detail) * 0.48, 218);
      const substep = step * 0.22 * detail;
      for (let sub = 0; sub < 4; sub += 1) {
        const offsetX = (sub % 2 ? 1 : -1) * substep;
        const offsetY = (sub < 2 ? -1 : 1) * substep;
        addDot(frame, { x: x + offsetX, y: y + offsetY, z: detail }, 0.24 + detail * 0.34, 0.08 + detail * 0.7, 178);
      }
    }
  }
  return frame;
}

/** Builds `segmenting`: image pixels softly organize into three distinct regions. */
export function segmentFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(9 * density));
  const rows = Math.max(6, Math.round(8 * density));
  const step = (radius * 1.46) / columns;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = center + (column - columns / 2) * step;
      const y = center + (row - rows / 2) * step;
      const region =
        Math.floor((Math.sin(column * 0.74 + time * 0.36) + Math.cos(row * 0.8 - time * 0.28) + 2) * 0.75) % 3;
      const pulse = (Math.sin(time * 0.8 + region * 1.8) + 1) / 2;
      addRect(
        frame,
        { x, y, width: step * 0.72, height: step * 0.72, z: pulse },
        0.2 + pulse * 0.46,
        [188, 244, 310][region],
      );
    }
  }
  return frame;
}

/** Builds `masking`: a soft active mask travels through a compact image field. */
export function maskFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(9 * density));
  const rows = Math.max(6, Math.round(8 * density));
  const step = (radius * 1.46) / columns;
  const maskX = Math.sin(time * 0.52) * 0.28;
  const maskY = Math.cos(time * 0.44) * 0.2;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = column / Math.max(1, columns - 1) - 0.5;
      const ny = row / Math.max(1, rows - 1) - 0.5;
      const inside = Math.max(0, 1 - Math.hypot(nx - maskX, ny - maskY) * 3.1);
      const x = center + (column - columns / 2) * step;
      const y = center + (row - rows / 2) * step;
      addRect(
        frame,
        { x, y, width: step * 0.7, height: step * 0.7, z: inside },
        0.08 + inside * 0.8,
        inside > 0.45 ? 46 : 212,
      );
    }
  }
  return frame;
}

/** Builds `inpainting`: a central missing patch restores in a softly rippling wave. */
export function inpaintFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const columns = Math.max(7, Math.round(9 * density));
  const rows = Math.max(7, Math.round(9 * density));
  const step = (radius * 1.46) / columns;
  const fill = (Math.sin(time * 0.58) + 1) / 2;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const nx = column / Math.max(1, columns - 1) - 0.5;
      const ny = row / Math.max(1, rows - 1) - 0.5;
      const distance = Math.min(1, Math.hypot(nx, ny) * 2);
      const ripple = (Math.sin(distance * 12 - time * 1.45) + 1) / 2;
      const restored = Math.max(0, Math.min(1, (fill - distance * 0.48) * 2.2 + ripple * 0.16));
      const x = center + (column - columns / 2) * step;
      const y = center + (row - rows / 2) * step;
      addRect(frame, { x, y, width: step * 0.7, height: step * 0.7, z: restored }, 0.1 + restored * 0.72, 186);
    }
  }
  addDot(frame, { x: center, y: center, z: 1 }, 0.72 + fill * 0.74, 0.26 + fill * 0.66, 164);
  return frame;
}

/** Builds `interpolating`: observed chart points bridge a missing section as a calm dotted curve. */
export function interpolateFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const center = centerOf(radius);
  const points = Math.max(22, Math.round(30 * density));
  const bridge = (Math.sin(time * 0.68) + 1) / 2;
  const valueAt = (p: number) => Math.sin(p * Math.PI * 2.1) * 0.27 + Math.cos(p * Math.PI * 5.1) * 0.09;
  for (let index = 0; index < points; index += 1) {
    const p = index / Math.max(1, points - 1);
    const inGap = p > 0.37 && p < 0.67;
    const x = center + (p - 0.5) * radius * 1.42;
    const y = center - valueAt(p) * radius;
    const confidence = inGap ? 0.12 + bridge * 0.66 : 0.58;
    addDot(frame, { x, y, z: confidence }, inGap ? 0.28 + bridge * 0.42 : 0.5, confidence, inGap ? 166 : 216);
    if (!inGap && index % 4 === 0) addDot(frame, { x, y, z: 0.9 }, 0.94, 0.92, 202);
  }
  return frame;
}
