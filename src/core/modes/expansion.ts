import type { FrameContext, OrbFrame, ProjectedPoint } from './shared';
import { addArc, addDot, addLine, addRect, createFrame, TAU } from './shared';
import { densityCount, safeThickness } from './shape-metrics';

const center = (radius: number) => radius / 0.82;
const pulse = (time: number, seed = 0, speed = 1) => (Math.sin(time * speed + seed) + 1) / 2;

function addWorkflowCard(
  frame: OrbFrame,
  x: number,
  y: number,
  width: number,
  height: number,
  z: number,
  alpha: number,
  tone: number,
  time: number,
  variant: number,
  skeletonRows: number,
): void {
  const patterns = [
    [0.72, 0.46, 0.62],
    [0.38, 0.74, 0.52],
    [0.6, 0.35, 0.7],
    [0.48, 0.67, 0.42],
  ];
  const pattern = patterns[variant % patterns.length];
  const breath = 0.78 + (Math.sin(time * 1.7 + variant * 1.13) + 1) * 0.11;
  addRect(frame, { x, y, width, height, z }, alpha * 0.48 * breath);
  if (variant % 4 === 0) {
    addDot(frame, { x: x + width * 0.2, y: y + height * 0.23, z: z + 0.03 }, height * 0.09, alpha * 0.32);
  } else if (variant % 4 === 1) {
    for (let control = 0; control < 3; control += 1) {
      addRect(
        frame,
        {
          x: x + width * (0.18 + control * 0.2),
          y: y + height * 0.2,
          width: width * 0.13,
          height: height * 0.1,
          z: z + 0.03,
        },
        alpha * 0.26,
      );
    }
  } else if (variant % 4 === 2) {
    addRect(
      frame,
      { x: x + width * 0.18, y: y + height * 0.16, width: width * 0.26, height: height * 0.15, z: z + 0.03 },
      alpha * 0.26,
    );
    addRect(
      frame,
      { x: x + width * 0.5, y: y + height * 0.16, width: width * 0.32, height: height * 0.15, z: z + 0.03 },
      alpha * 0.2,
    );
  } else {
    addRect(
      frame,
      { x: x + width * 0.18, y: y + height * 0.16, width: width * 0.18, height: height * 0.15, z: z + 0.03 },
      alpha * 0.24,
    );
    addRect(
      frame,
      { x: x + width * 0.42, y: y + height * 0.16, width: width * 0.4, height: height * 0.15, z: z + 0.03 },
      alpha * 0.22,
    );
  }
  const rowHeight = height / (skeletonRows + 2);
  for (let row = 0; row < skeletonRows; row += 1) {
    const length = width * pattern[row % pattern.length];
    const left = x + width * 0.18;
    const top = y + rowHeight * (row + 1.1);
    const skeletonHeight = Math.max(0.8, rowHeight * 0.2);
    addRect(
      frame,
      { x: left, y: top, width: length, height: skeletonHeight, z: z + 0.01 },
      alpha * (0.26 + row * 0.045),
    );
    const stripeWidth = Math.max(1.4, length * 0.24);
    const stripeX = left + ((time * 0.58 + variant * 0.19 + row * 0.13) % 1) * (length + stripeWidth) - stripeWidth;
    const highlightLeft = Math.max(left, stripeX);
    const highlightRight = Math.min(left + length, stripeX + stripeWidth);
    if (highlightRight > highlightLeft) {
      addRect(
        frame,
        { x: highlightLeft, y: top, width: highlightRight - highlightLeft, height: skeletonHeight, z: z + 0.02 },
        Math.min(1, alpha * 0.92),
      );
    }
  }
  addRect(
    frame,
    { x: x + width * 0.08, y: y + height * 0.12, width: width * 0.06, height: height * 0.76, z: z + 0.02 },
    alpha * 0.75,
    tone,
  );
}

function addWorkflowConnector(
  frame: OrbFrame,
  from: ProjectedPoint,
  to: ProjectedPoint,
  progress: number,
  tone: number,
): void {
  const bend = Math.max(8, Math.abs(to.x - from.x) * 0.46);
  const controls = [
    { x: from.x + bend, y: from.y, z: from.z },
    { x: to.x - bend, y: to.y, z: to.z },
  ];
  const pointAt = (t: number): ProjectedPoint => {
    const inverse = 1 - t;
    return {
      x:
        inverse ** 3 * from.x +
        3 * inverse ** 2 * t * controls[0].x +
        3 * inverse * t ** 2 * controls[1].x +
        t ** 3 * to.x,
      y:
        inverse ** 3 * from.y +
        3 * inverse ** 2 * t * controls[0].y +
        3 * inverse * t ** 2 * controls[1].y +
        t ** 3 * to.y,
      z:
        inverse ** 3 * from.z +
        3 * inverse ** 2 * t * controls[0].z +
        3 * inverse * t ** 2 * controls[1].z +
        t ** 3 * to.z,
    };
  };
  let previous = pointAt(0);
  const segments = 12;
  for (let segment = 1; segment <= segments; segment += 1) {
    const point = pointAt(segment / segments);
    addLine(frame, previous, point, 0.32, 0.72, 214);
    previous = point;
  }
  const packet = pointAt(progress);
  addRect(frame, { x: packet.x - 1.9, y: packet.y - 1.35, width: 3.8, height: 2.7, z: 1.3 }, 0.92, tone);
}

/** Draws an indeterminate download channel that fills in successive blocks. */
export function downloadFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const count = densityCount({ time, radius, density }, { base: 8, minimum: 5, maximum: 15 });
  const gap = (radius * 1.45) / count;
  for (let i = 0; i < count; i += 1) {
    const p = (time * 0.38 + i / count) % 1;
    addRect(
      frame,
      {
        x: c - radius * 0.72 + i * gap,
        y: c - radius * 0.1,
        width: safeThickness({ time, radius, density, particleRadius }, gap * 0.68, gap, 1),
        height: radius * (0.16 + p * 0.18),
        z: p,
      },
      0.2 + p * 0.7,
      200,
    );
  }
  return frame;
}

/** Draws a retry loop whose incomplete ring repeatedly regains confidence. */
export function retryFrame({ time, radius, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const progress = (time * 0.46) % 1;
  const width = safeThickness({ time, radius, density: 1, particleRadius }, radius * 0.12, radius * 0.3, radius * 0.05);
  addArc(frame, { x: c, y: c, radius: radius * 0.54, startAngle: 0, endAngle: TAU, width, z: -0.5 }, 0.1, 210);
  addArc(
    frame,
    {
      x: c,
      y: c,
      radius: radius * 0.54,
      startAngle: -Math.PI / 2,
      endAngle: -Math.PI / 2 + progress * TAU * 0.82,
      width,
      z: progress,
    },
    0.9,
    26,
  );
  return frame;
}

/** Draws a scanner sweep through a bounded inspection field. */
export function scannerFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const lines = densityCount({ time, radius, density }, { base: 7, minimum: 5, maximum: 13 });
  const y = c - radius * 0.55 + ((time * 0.4) % 1) * radius * 1.1;
  for (let i = 0; i < lines; i += 1)
    addRect(
      frame,
      {
        x: c - radius * 0.72,
        y: c - radius * 0.55 + (i * radius * 1.1) / lines,
        width: radius * 1.44,
        height: 0.7,
        z: -0.6,
      },
      0.09,
      205,
    );
  addRect(
    frame,
    {
      x: c - radius * 0.72,
      y,
      width: radius * 1.44,
      height: safeThickness({ time, radius, density, particleRadius }, radius * 0.045, radius * 0.12, 0.8),
      z: 1,
    },
    0.85,
    178,
  );
  return frame;
}

/** Draws source-like blocks that settle into a compiled arrangement. */
export function compileFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const rows = densityCount({ time, radius, density }, { base: 5, minimum: 3, maximum: 9 });
  const rowPitch = (radius * 1.04) / rows;
  const h = safeThickness(
    { time, radius, density, particleRadius },
    radius * 0.1,
    rowPitch,
    Math.min(radius * 0.05, rowPitch * 0.22),
  );
  for (let row = 0; row < rows; row += 1) {
    const done = pulse(time, row * 1.8, 0.8);
    addRect(
      frame,
      {
        x: c - radius * 0.68,
        y: c - radius * 0.52 + (row * radius * 1.04) / rows,
        width: radius * (0.34 + done * 0.95),
        height: h,
        z: done,
      },
      0.3 + done * 0.6,
      200 + row * 8,
    );
  }
  return frame;
}

/** Draws pagination markers that advance through a moving active page. */
export function paginationFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const pages = densityCount({ time, radius, density }, { base: 6, minimum: 4, maximum: 12 });
  const step = (radius * 1.45) / pages;
  const active = (time * 0.65) % pages;
  for (let i = 0; i < pages; i += 1) {
    const hot = Math.max(0, 1 - Math.abs(i - active));
    const size = safeThickness(
      { time, radius, density, particleRadius },
      step * (0.38 + hot * 0.24),
      step,
      step * 0.22,
    );
    addRect(
      frame,
      { x: c - radius * 0.72 + i * step, y: c - size / 2, width: size, height: size, z: hot },
      0.22 + hot * 0.72,
      30,
    );
  }
  return frame;
}

/** Draws weighted flows travelling across a compact Sankey-style system. */
export function sankeyFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const flows = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  for (let i = 0; i < flows; i += 1) {
    const y1 = c + (i - (flows - 1) / 2) * radius * 0.22;
    const y2 = c + Math.sin(i * 2.1) * radius * 0.34;
    const left = { x: c - radius * 0.65, y: y1, z: -0.2 };
    const right = { x: c + radius * 0.65, y: y2, z: 0.2 };
    addLine(frame, left, right, 0.2, radius * (0.025 + (i % 3) * 0.018), 174 + i * 22);
    const p = (time * (0.22 + i * 0.035) + i / flows) % 1;
    addDot(
      frame,
      { x: left.x + (right.x - left.x) * p, y: left.y + (right.y - left.y) * p, z: 0.8 },
      0.6,
      0.88,
      174 + i * 22,
    );
  }
  return frame;
}

/** Draws a radar plot that breathes between several measured axes. */
export function radarPlotFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const axes = densityCount({ time, radius, density }, { base: 6, minimum: 4, maximum: 10 });
  const points: ProjectedPoint[] = [];
  for (let i = 0; i < axes; i += 1) {
    const a = -Math.PI / 2 + (i * TAU) / axes;
    const value = 0.3 + pulse(time, i * 1.4, 0.75) * 0.52;
    const point = { x: c + Math.cos(a) * radius * value, y: c + Math.sin(a) * radius * value, z: value };
    points.push(point);
    addLine(
      frame,
      { x: c, y: c, z: -0.4 },
      { x: c + Math.cos(a) * radius * 0.76, y: c + Math.sin(a) * radius * 0.76, z: -0.4 },
      0.12,
      0.45,
      210,
    );
  }
  points.forEach((point, i) => {
    addLine(frame, point, points[(i + 1) % axes], 0.62, 1, 184);
    addDot(frame, point, 0.75, 0.88, 184);
  });
  return frame;
}

/** Draws a live Gantt chart of parallel scheduled work. */
export function ganttFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const lanes = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  const h = safeThickness({ time, radius, density, particleRadius }, radius * 0.1, radius * 0.25, radius * 0.06);
  for (let lane = 0; lane < lanes; lane += 1)
    for (let task = 0; task < 3; task += 1) {
      const start = (task * 0.29 + lane * 0.13 + time * 0.04) % 1;
      const width = radius * (0.22 + ((task + lane) % 3) * 0.11);
      addRect(
        frame,
        {
          x: c - radius * 0.72 + start * radius * 1.44,
          y: c - radius * 0.5 + (lane * radius) / lanes,
          width,
          height: h,
          z: task * 0.2,
        },
        0.5 + task * 0.12,
        180 + lane * 13,
      );
    }
  return frame;
}

/** Draws an activity calendar with a travelling intensity wave. */
export function calendarFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const cols = densityCount({ time, radius, density }, { base: 7, minimum: 5, maximum: 12 });
  const rows = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 7 });
  const cell = (radius * 1.42) / Math.max(cols, rows);
  const side = safeThickness({ time, radius, density, particleRadius }, cell * 0.72, cell, cell * 0.18);
  for (let y = 0; y < rows; y += 1)
    for (let x = 0; x < cols; x += 1) {
      const value = pulse(time, x * 0.91 + y * 1.63, 0.9);
      addRect(
        frame,
        {
          x: c - (cols * cell) / 2 + x * cell,
          y: c - (rows * cell) / 2 + y * cell,
          width: side,
          height: side,
          z: value,
        },
        0.12 + value * 0.72,
        110 + value * 80,
      );
    }
  return frame;
}

/** Draws a target-measuring bullet chart with animated actual and threshold marks. */
export function bulletFrame({ time, radius, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const actual = 0.35 + pulse(time, 0.3, 0.8) * 0.48;
  const target = 0.65 + pulse(time, 1.8, 0.55) * 0.18;
  const h = safeThickness({ time, radius, density: 1, particleRadius }, radius * 0.18, radius * 0.38, radius * 0.08);
  addRect(frame, { x: c - radius * 0.72, y: c - h / 2, width: radius * 1.44, height: h, z: -0.5 }, 0.1, 215);
  addRect(
    frame,
    { x: c - radius * 0.72, y: c - h / 2, width: radius * 1.44 * actual, height: h, z: actual },
    0.82,
    196,
  );
  addRect(
    frame,
    { x: c - radius * 0.72 + radius * 1.44 * target, y: c - radius * 0.27, width: 2, height: radius * 0.54, z: 1 },
    0.9,
    36,
  );
  return frame;
}

/** Draws a compact animated box plot with changing whiskers and quartiles. */
export function boxPlotFrame({ time, radius, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const low = 0.14 + pulse(time, 0, 0.7) * 0.16;
  const q1 = 0.3 + pulse(time, 1, 0.6) * 0.12;
  const q3 = 0.6 + pulse(time, 2, 0.65) * 0.12;
  const high = 0.82 + pulse(time, 3, 0.5) * 0.1;
  const x = (p: number) => c - radius * 0.72 + p * radius * 1.44;
  const h = safeThickness({ time, radius, density: 1, particleRadius }, radius * 0.22, radius * 0.5, radius * 0.1);
  addLine(frame, { x: x(low), y: c, z: 0 }, { x: x(high), y: c, z: 0 }, 0.45, 1, 210);
  addRect(frame, { x: x(q1), y: c - h / 2, width: x(q3) - x(q1), height: h, z: 0.5 }, 0.68, 276);
  addLine(
    frame,
    { x: x((q1 + q3) / 2), y: c - h / 2, z: 0.8 },
    { x: x((q1 + q3) / 2), y: c + h / 2, z: 0.8 },
    0.9,
    1.5,
    32,
  );
  return frame;
}

/** Draws packets dispatched into several outbound channels. */
export function dispatchFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const lanes = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 8 });
  for (let i = 0; i < lanes; i += 1) {
    const y = c + (i - (lanes - 1) / 2) * radius * 0.23;
    addLine(frame, { x: c - radius * 0.65, y: c, z: -0.2 }, { x: c + radius * 0.65, y, z: -0.2 }, 0.16, 0.5, 196);
    const p = (time * 0.42 + i / lanes) % 1;
    addDot(frame, { x: c - radius * 0.65 + p * radius * 1.3, y: c + (y - c) * p, z: 0.8 }, 0.78, 0.88, 196);
  }
  return frame;
}

/** Draws a low-code batch workflow: skeleton cards rearrange, split into parallel work, merge, then dispatch. */
export function batchFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const cardWidth = safeThickness(
    { time, radius, density, particleRadius },
    radius * 0.25,
    radius * 0.36,
    radius * 0.07,
  );
  const cardHeight = radius * 0.22;
  const layoutTime = time * 0.16;
  const layoutIndex = Math.floor(layoutTime) % 3;
  const transition = layoutTime % 1;
  const ease = transition * transition * (3 - 2 * transition);
  const skeletonRows = densityCount({ time, radius, density }, { base: 3, minimum: 2, maximum: 5 });
  const branches = densityCount({ time, radius, density }, { base: 2, minimum: 1, maximum: 4 });
  const branchStart = 2;
  const merge = branchStart + branches;
  const output = merge + 1;
  const layoutPosition = (layout: number, index: number): readonly [number, number] => {
    const branch = index - branchStart;
    const spread = branches === 1 ? 0 : (branch / (branches - 1) - 0.5) * 0.86;
    if (layout === 0) {
      if (index === 0) return [-0.8, 0];
      if (index === 1) return [-0.46, 0];
      if (index === merge) return [0.42, 0];
      if (index === output) return [0.78, 0];
      return [-0.03, spread];
    }
    if (layout === 1) {
      if (index === 0) return [-0.8, 0.3];
      if (index === 1) return [-0.46, -0.15];
      if (index === merge) return [0.42, 0.18];
      if (index === output) return [0.78, -0.12];
      return [-0.04 + (branch % 2 ? -0.05 : 0.05), -spread * 0.78 - 0.1];
    }
    if (index === 0) return [-0.8, -0.28];
    if (index === 1) return [-0.46, 0.2];
    if (index === merge) return [0.42, -0.2];
    if (index === output) return [0.78, 0.24];
    return [-0.02 + (branch % 2 ? 0.08 : -0.08), spread * 0.64 + (branch % 2 ? 0.08 : -0.08)];
  };
  const cards = Array.from({ length: output + 1 }, (_, index) => {
    const current = layoutPosition(layoutIndex, index);
    const next = layoutPosition((layoutIndex + 1) % 3, index);
    const response = Math.sin(time * 1.35 - index * 0.86) * radius * 0.018;
    return {
      x: c + (current[0] + (next[0] - current[0]) * ease) * radius - cardWidth / 2 + response,
      y:
        c +
        (current[1] + (next[1] - current[1]) * ease) * radius -
        cardHeight / 2 +
        response * (index % 2 ? -0.65 : 0.65),
      z: index * 0.08,
    };
  });
  const links = [
    [0, 1],
    ...Array.from({ length: branches }, (_, branch) => [1, branchStart + branch] as const),
    ...Array.from({ length: branches }, (_, branch) => [branchStart + branch, merge] as const),
    [merge, output],
  ] as const;
  links.forEach(([source, target], index) => {
    const from = { x: cards[source].x + cardWidth, y: cards[source].y + cardHeight / 2, z: cards[source].z };
    const to = { x: cards[target].x, y: cards[target].y + cardHeight / 2, z: cards[target].z };
    addWorkflowConnector(frame, from, to, (time * 0.46 + index * 0.19) % 1, index === 5 ? 48 : index % 2 ? 196 : 32);
  });
  cards.forEach((card, index) => {
    const active = Math.max(0, Math.sin(time * 0.78 - index * 0.95));
    const tone = index === output ? 48 : index >= branchStart && index < merge ? 196 : 214;
    addWorkflowCard(
      frame,
      card.x,
      card.y,
      cardWidth,
      cardHeight,
      card.z,
      0.3 + active * 0.54,
      tone,
      time,
      index,
      skeletonRows,
    );
  });
  return frame;
}

/** Draws a checkpoint route where a courier confirms each reached stage before continuing. */
export function checkpointFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const checks = densityCount({ time, radius, density }, { base: 5, minimum: 3, maximum: 9 });
  const progress = (time * 0.26) % 1;
  const active = progress * (checks - 1);
  const pointAt = (index: number) => {
    const p = index / Math.max(1, checks - 1);
    return { x: c - radius * 0.7 + p * radius * 1.4, y: c + Math.sin(p * Math.PI * 2.1) * radius * 0.28, z: p };
  };
  for (let i = 0; i < checks; i += 1) {
    const point = pointAt(i);
    if (i) addLine(frame, pointAt(i - 1), point, 0.2, 0.68, 214);
    const completed = Math.max(0, Math.min(1, active - i + 1));
    addArc(
      frame,
      {
        x: point.x,
        y: point.y,
        radius: radius * 0.07,
        startAngle: -Math.PI / 2,
        endAngle: -Math.PI / 2 + TAU * completed,
        width: 1.4,
        z: completed,
      },
      0.24 + completed * 0.7,
      completed ? 144 : 214,
    );
    if (completed > 0.96) {
      addLine(
        frame,
        { x: point.x - radius * 0.026, y: point.y, z: 1 },
        { x: point.x - radius * 0.004, y: point.y + radius * 0.025, z: 1 },
        0.92,
        1.2,
        144,
      );
      addLine(
        frame,
        { x: point.x - radius * 0.004, y: point.y + radius * 0.025, z: 1 },
        { x: point.x + radius * 0.038, y: point.y - radius * 0.035, z: 1 },
        0.92,
        1.2,
        144,
      );
    }
  }
  const lower = Math.floor(active);
  const local = active - lower;
  const from = pointAt(lower);
  const to = pointAt(Math.min(checks - 1, lower + 1));
  addDot(frame, { x: from.x + (to.x - from.x) * local, y: from.y + (to.y - from.y) * local, z: 1 }, 1.1, 0.94, 38);
  return frame;
}

/** Draws ranked work cards whose leading priority rises to the front. */
export function priorityFrame({ time, radius, density, particleRadius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const cards = densityCount({ time, radius, density }, { base: 4, minimum: 3, maximum: 7 });
  const cardPitch = (radius * 1.04) / cards;
  const h = safeThickness(
    { time, radius, density, particleRadius },
    radius * 0.13,
    cardPitch,
    Math.min(radius * 0.06, cardPitch * 0.22),
  );
  for (let i = 0; i < cards; i += 1) {
    const score = pulse(time, i * 1.7, 0.7);
    addRect(
      frame,
      {
        x: c - radius * 0.64,
        y: c - radius * 0.52 + (i * radius * 1.04) / cards,
        width: radius * (0.3 + score * 0.95),
        height: h,
        z: score,
      },
      0.3 + score * 0.6,
      22 + i * 18,
    );
  }
  return frame;
}

/** Draws a verification trace that lights each proof point in sequence. */
export function verifyFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const checks = densityCount({ time, radius, density }, { base: 5, minimum: 3, maximum: 10 });
  for (let i = 0; i < checks; i += 1) {
    const p = i / Math.max(1, checks - 1);
    const y = c + Math.sin(p * TAU * 1.2) * radius * 0.24;
    const hot = pulse(time, i * 1.2, 0.9);
    addDot(frame, { x: c - radius * 0.68 + p * radius * 1.36, y, z: hot }, 0.5 + hot * 0.55, 0.3 + hot * 0.6, 142);
  }
  return frame;
}

/** Draws a weight on a smooth pendulum arc. */
export function pendulumFrame({ time, radius }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const angle = Math.sin(time * 1.25) * 0.72;
  const end = { x: c + Math.sin(angle) * radius * 0.62, y: c + Math.cos(angle) * radius * 0.62, z: 0.7 };
  addLine(frame, { x: c, y: c - radius * 0.56, z: -0.2 }, end, 0.52, 1, 36);
  addDot(frame, end, 1.35, 0.9, 36);
  return frame;
}

/** Draws calm particles drifting across a small invisible current. */
export function driftFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const count = densityCount({ time, radius, density }, { base: 18, minimum: 10, maximum: 38 });
  for (let i = 0; i < count; i += 1) {
    const p = (time * (0.08 + (i % 4) * 0.025) + i / count) % 1;
    addDot(
      frame,
      { x: c - radius * 0.75 + p * radius * 1.5, y: c + Math.sin(i * 2.4 + time * 0.5) * radius * 0.35, z: p },
      0.4 + p * 0.58,
      0.1 + p * 0.55,
      202,
    );
  }
  return frame;
}

/** Draws a soft rainfall field with passing illuminated drops. */
export function rainFrame({ time, radius, density }: FrameContext): OrbFrame {
  const frame = createFrame();
  const c = center(radius);
  const drops = densityCount({ time, radius, density }, { base: 20, minimum: 12, maximum: 42 });
  for (let i = 0; i < drops; i += 1) {
    const p = (time * (0.32 + (i % 3) * 0.06) + i / drops) % 1;
    const x = c - radius * 0.72 + ((i * 1.71) % 1) * radius * 1.44;
    const y = c - radius * 0.72 + p * radius * 1.44;
    addLine(frame, { x, y: y - radius * 0.11, z: p }, { x, y, z: p }, 0.14 + p * 0.5, 0.55, 204);
  }
  return frame;
}
