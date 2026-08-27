import { clamp } from './math';
import { DEFAULT_OPTIONS, mergeOptions } from './options';
import { paintFrame } from './renderer';
import { prefersReducedMotion, resolveTheme } from './theme';
import type { FrameContext, LoaderszOrbOptions, OrbFrame } from './types';

/** Builds a complete frame from the current timeline context and resolved options. */
export type FrameBuilder = (context: FrameContext, options: Required<LoaderszOrbOptions>) => OrbFrame;

/** Shared Canvas lifecycle for the full loader and tree-shakeable single-mode loaders. */
export class CanvasLoader {
  /** Canvas owned and resized by this instance. */
  readonly canvas: HTMLCanvasElement;
  /** The retained 2D context used to paint each generated frame. */
  readonly context: CanvasRenderingContext2D;
  /** Fully resolved current options. Prefer {@link setOptions} to changing this object directly. */
  options = DEFAULT_OPTIONS;
  private reducedMotion = false;
  private readonly motionQuery: MediaQueryList;
  private animationFrame: number | null = null;
  private colorOverride: string | undefined;
  private elapsed = 0.6;
  private clockAnchor = performance.now();
  private usesLegacyMotionListener = false;

  /** Creates, draws and (unless paused) starts one animation. */
  constructor(
    canvas: HTMLCanvasElement,
    options: LoaderszOrbOptions,
    private readonly frameBuilder: FrameBuilder,
  ) {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Loadersz needs a Canvas 2D context.');
    this.canvas = canvas;
    this.context = context;
    this.options = mergeOptions(options);
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.configureCanvas();
    this.refreshColorOverride();
    this.bindLifecycle();
    this.draw();
    this.syncAnimation();
  }

  /** Applies a partial update, preserves the current timeline phase and redraws immediately. */
  setOptions(options: LoaderszOrbOptions): void {
    const now = performance.now();
    this.elapsed = this.currentTime(now);
    this.clockAnchor = now;
    this.options = mergeOptions({ ...this.options, ...options });
    if (options.size !== undefined) this.configureCanvas();
    if (options.color !== undefined) this.refreshColorOverride();
    if (options.ariaLabel !== undefined) this.canvas.setAttribute('aria-label', this.options.ariaLabel);
    this.draw();
    this.syncAnimation();
  }

  /** Permanently releases browser listeners and cancels a pending animation frame. */
  destroy(): void {
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    document.removeEventListener('visibilitychange', this.onDocumentVisibility);
    if (this.usesLegacyMotionListener) this.motionQuery.removeListener(this.onMotionPreference);
    else this.motionQuery.removeEventListener('change', this.onMotionPreference);
  }

  private configureCanvas(): void {
    const size = Math.max(16, this.options.size);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(size * devicePixelRatio);
    this.canvas.height = Math.round(size * devicePixelRatio);
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', this.options.ariaLabel);
    this.context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  private bindLifecycle(): void {
    this.reducedMotion = prefersReducedMotion();
    document.addEventListener('visibilitychange', this.onDocumentVisibility);
    if (typeof this.motionQuery.addEventListener === 'function') {
      this.motionQuery.addEventListener('change', this.onMotionPreference);
      return;
    }
    this.usesLegacyMotionListener = true;
    this.motionQuery.addListener(this.onMotionPreference);
  }

  private draw(): void {
    const size = Math.max(16, this.options.size);
    this.context.clearRect(0, 0, size, size);
    const frame = this.frameBuilder(
      { time: this.currentTime(performance.now()), radius: size * 0.41, density: clamp(this.options.density, 0.35, 2) },
      this.options,
    );
    paintFrame(
      this.context,
      frame,
      resolveTheme(this.options.theme),
      this.options.hue,
      this.colorOverride,
      clamp(this.options.particleRadius, 0.5, 2.5),
    );
  }

  private canAnimate(): boolean {
    return (
      !this.options.paused && (!this.reducedMotion || this.options.forceMotion) && document.visibilityState !== 'hidden'
    );
  }

  private readonly syncAnimation = (): void => {
    if (this.canAnimate() && this.animationFrame === null) this.animationFrame = requestAnimationFrame(this.render);
    if (!this.canAnimate() && this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  };

  private readonly render = (): void => {
    this.animationFrame = null;
    this.draw();
    this.syncAnimation();
  };

  private readonly onDocumentVisibility = (): void => this.syncAnimation();

  private readonly onMotionPreference = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches;
    this.draw();
    this.syncAnimation();
  };

  /** Resolves CSS colours, including inherited custom properties, once per option update. */
  private refreshColorOverride(): void {
    const color = this.options.color.trim();
    if (!color) {
      this.colorOverride = undefined;
      return;
    }
    const previous = this.canvas.style.color;
    this.canvas.style.color = '';
    this.canvas.style.color = color;
    this.colorOverride = this.canvas.style.color ? getComputedStyle(this.canvas).color : undefined;
    this.canvas.style.color = previous;
  }

  private currentTime(now: number): number {
    return this.elapsed + ((now - this.clockAnchor) / 1000) * this.options.speed;
  }
}
