import { MAX_PALETTE_COLORS } from './options';
import type { OrbArc, OrbFrame, OrbLine, OrbRect, Dot } from './types';

type ColorEnvironmentListener = () => void;

const colorEnvironmentListeners = new Set<ColorEnvironmentListener>();
let colorEnvironmentCleanup: (() => void) | undefined;

/**
 * Parses the custom element's semicolon-delimited palette attribute.
 *
 * A semicolon is deliberately used because functional CSS colours such as `rgb()` contain
 * commas. CSS syntax is validated later against the canvas that owns the rendered loader.
 *
 * @param value Raw `palette` attribute value.
 * @returns Trimmed non-empty entries, limited to eight colours.
 */
export function parsePaletteAttribute(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(';')
    .map((color) => color.trim())
    .filter(Boolean)
    .slice(0, MAX_PALETTE_COLORS);
}

/**
 * Resolves one CSS colour in the owning canvas's cascade.
 *
 * @param canvas Canvas whose inherited custom properties should be used.
 * @param color CSS colour candidate.
 * @returns A browser-resolved colour string, or `undefined` when the candidate is invalid.
 */
export function resolveCssColor(canvas: HTMLCanvasElement, color: string): string | undefined {
  const candidate = color.trim();
  if (!candidate) return undefined;

  const previous = canvas.style.color;
  canvas.style.color = '';
  canvas.style.color = candidate;
  const resolved = canvas.style.color ? getComputedStyle(canvas).color : '';
  canvas.style.color = previous;
  return resolved || undefined;
}

/**
 * Resolves and validates a caller palette against the canvas's actual CSS cascade.
 *
 * @param canvas Canvas whose CSS custom properties should be resolved.
 * @param palette Normalized CSS colour candidates.
 * @returns Valid resolved colours in the caller's original order.
 */
export function resolvePalette(canvas: HTMLCanvasElement, palette: readonly string[]): string[] {
  return palette.map((color) => resolveCssColor(canvas, color)).filter((color): color is string => Boolean(color));
}

type PaletteDrawable = Pick<Dot | OrbLine | OrbRect | OrbArc, 'tone' | 'paletteRole'>;

/**
 * Gives untagged monochrome geometry stable palette roles before the renderer depth-sorts it.
 *
 * Builders can opt out with `paletteRole: null` to retain native material, or provide a numeric
 * role for semantic events such as a cube turn. This fallback gives ordinary rings, trails and
 * particle fields a deterministic palette distribution without every mode needing local boilerplate.
 *
 * @param frame Fresh geometry frame from a pure builder.
 * @param paletteLength Number of valid caller colours.
 * @returns Nothing. The freshly created frame is updated in place before it is rendered.
 */
export function assignFallbackPaletteRoles(frame: OrbFrame, paletteLength: number): void {
  if (paletteLength <= 1) return;
  assignRoles(frame.dots, paletteLength);
  assignRoles(frame.lines, paletteLength);
  assignRoles(frame.rects, paletteLength);
  assignRoles(frame.arcs, paletteLength);
}

function assignRoles(drawables: PaletteDrawable[], paletteLength: number): void {
  let eligible = 0;
  for (const drawable of drawables) {
    if (drawable.paletteRole === undefined && drawable.tone === undefined) eligible += 1;
  }
  if (eligible === 0) return;

  let index = 0;
  for (const drawable of drawables) {
    if (drawable.paletteRole !== undefined || drawable.tone !== undefined) continue;
    drawable.paletteRole = Math.floor((index * paletteLength) / eligible);
    index += 1;
  }
}

/**
 * Subscribes to global theme-token changes shared by every live loader in this document.
 *
 * The observer intentionally watches only `html` and `body` class/style changes plus the system
 * colour-scheme preference. It never runs during rendering and is created once per document.
 *
 * @param listener Callback that should resolve colours and redraw.
 * @returns A function that removes this listener and tears down shared browser listeners when unused.
 */
export function subscribeToColorEnvironment(listener: ColorEnvironmentListener): () => void {
  colorEnvironmentListeners.add(listener);
  ensureColorEnvironmentObserver();
  return () => {
    colorEnvironmentListeners.delete(listener);
    if (colorEnvironmentListeners.size === 0) {
      colorEnvironmentCleanup?.();
      colorEnvironmentCleanup = undefined;
    }
  };
}

function ensureColorEnvironmentObserver(): void {
  if (colorEnvironmentCleanup || typeof document === 'undefined') return;

  const notify = (): void => {
    colorEnvironmentListeners.forEach((listener) => listener());
  };
  const observer =
    typeof MutationObserver === 'undefined'
      ? undefined
      : new MutationObserver((records) => {
          if (records.some((record) => record.type === 'attributes')) notify();
        });
  const options: MutationObserverInit = { attributes: true, attributeFilter: ['class', 'style'] };
  observer?.observe(document.documentElement, options);
  if (document.body) observer?.observe(document.body, options);

  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const onThemeChange = (): void => notify();
  if (typeof query.addEventListener === 'function') query.addEventListener('change', onThemeChange);
  else query.addListener(onThemeChange);

  colorEnvironmentCleanup = () => {
    observer?.disconnect();
    if (typeof query.removeEventListener === 'function') query.removeEventListener('change', onThemeChange);
    else query.removeListener(onThemeChange);
  };
}
