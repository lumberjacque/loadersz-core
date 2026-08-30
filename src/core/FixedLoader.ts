import { CanvasLoader } from './CanvasLoader';
import { DEFAULT_OPTIONS } from './options';
import type { FrameBuilder } from './CanvasLoader';
import type { LoaderszOrbOptions, OrbState, OrbTheme } from './types';

/** Options for a loader whose visual state is selected by its import path. */
export type LoaderszSingleModeOptions = Omit<LoaderszOrbOptions, 'state'>;

/** Public controller API returned by a single-mode entry point. */
export interface LoaderszSingleModeLoader {
  /** Canvas owned by this controller. */
  readonly canvas: HTMLCanvasElement;
  /** Applies an update while keeping the imported visual state fixed. */
  setOptions(options: LoaderszSingleModeOptions): void;
  /** Re-resolves local CSS-variable colours and redraws without resetting the timeline phase. */
  refresh(): void;
  /** Stops animation and releases browser listeners. */
  destroy(): void;
}

/** Constructor shape exposed by a single-mode entry point. */
export type LoaderszSingleModeConstructor = new (
  canvas: HTMLCanvasElement,
  options?: LoaderszSingleModeOptions,
) => LoaderszSingleModeLoader;

/**
 * Creates a Canvas controller permanently bound to one visual state.
 *
 * Keeping the state outside the caller's options lets a bundler retain only the selected frame
 * builder. Calls to `setOptions` intentionally cannot change that state.
 *
 * @param state Semantic state permanently rendered by the returned constructor.
 * @param builder Pure frame builder for that state.
 * @returns A controller constructor that accepts every option except `state`.
 */
export function createFixedModeLoader(state: OrbState, builder: FrameBuilder): LoaderszSingleModeConstructor {
  return class LoaderszSingleModeLoader extends CanvasLoader {
    constructor(canvas: HTMLCanvasElement, options: LoaderszSingleModeOptions = {}) {
      super(canvas, { ...options, state }, builder);
    }

    override setOptions(options: LoaderszSingleModeOptions): void {
      super.setOptions({ ...options, state });
    }
  };
}

/**
 * Creates a native `<loadersz-loader>` element permanently bound to one visual state.
 *
 * The element keeps the normal size, speed, density, colour, theme, motion and accessibility
 * attributes. A `state` attribute is accepted for markup compatibility but the imported state
 * always wins.
 *
 * @param createLoader Fixed-state controller constructor to own the element's canvas.
 * @returns A custom-element constructor ready to register as `loadersz-loader`.
 */
export function createFixedModeElement(createLoader: LoaderszSingleModeConstructor): CustomElementConstructor {
  return class LoaderszSingleModeElement extends HTMLElement {
    private canvas: HTMLCanvasElement | null = null;
    private loader: LoaderszSingleModeLoader | null = null;

    static get observedAttributes(): string[] {
      return [
        'state',
        'size',
        'speed',
        'theme',
        'paused',
        'force-motion',
        'density',
        'particle-radius',
        'hue',
        'color',
        'palette',
        'aria-label',
      ];
    }

    connectedCallback(): void {
      if (this.loader) return;
      if (!this.canvas) this.canvas = document.createElement('canvas');
      this.style.display = 'inline-block';
      if (!this.canvas.isConnected) this.append(this.canvas);
      this.loader = new createLoader(this.canvas, this.readOptions());
    }

    disconnectedCallback(): void {
      this.loader?.destroy();
      this.loader = null;
    }

    attributeChangedCallback(name: string): void {
      if (name === 'aria-label' && this.canvas) this.canvas.setAttribute('aria-label', this.label);
      this.loader?.setOptions(this.readOptions());
    }

    /** Re-resolves CSS-variable colours after a local theme-token change. */
    refresh(): void {
      this.loader?.refresh();
    }

    /** Gets the semicolon-delimited `palette` attribute as an ordered colour list. */
    get palette(): readonly string[] {
      const value = this.getAttribute('palette');
      return value
        ? value
            .split(';')
            .map((color) => color.trim())
            .filter(Boolean)
            .slice(0, 8)
        : [];
    }

    /** Sets the ordered palette property without requiring attribute serialization by the caller. */
    set palette(palette: readonly string[] | string) {
      const values = typeof palette === 'string' ? palette.split(';') : palette;
      const value = values
        .map((color) => color.trim())
        .filter(Boolean)
        .slice(0, 8)
        .join('; ');
      if (value) this.setAttribute('palette', value);
      else this.removeAttribute('palette');
    }

    private get label(): string {
      return this.getAttribute('aria-label') || DEFAULT_OPTIONS.ariaLabel;
    }

    private readOptions(): LoaderszSingleModeOptions {
      return {
        size: Number(this.getAttribute('size')) || DEFAULT_OPTIONS.size,
        speed: Number(this.getAttribute('speed')) || DEFAULT_OPTIONS.speed,
        theme: (this.getAttribute('theme') || DEFAULT_OPTIONS.theme) as OrbTheme,
        paused: this.hasAttribute('paused') && this.getAttribute('paused') !== 'false',
        forceMotion: this.hasAttribute('force-motion') && this.getAttribute('force-motion') !== 'false',
        density: Number(this.getAttribute('density')) || DEFAULT_OPTIONS.density,
        particleRadius: Number(this.getAttribute('particle-radius')) || DEFAULT_OPTIONS.particleRadius,
        hue: this.hasAttribute('hue') ? Number(this.getAttribute('hue')) : DEFAULT_OPTIONS.hue,
        color: this.getAttribute('color') || DEFAULT_OPTIONS.color,
        palette: this.palette,
        ariaLabel: this.label,
      };
    }
  };
}
