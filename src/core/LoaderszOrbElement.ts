import { LoaderszLoader } from './LoaderszOrb';
import { DEFAULT_OPTIONS } from './options';
import type { LoaderszOrbOptions, OrbState, OrbTheme } from './types';

/**
 * Browser-native `<loadersz-loader>` custom element.
 *
 * Numeric attributes are parsed as numbers. Change an observed attribute at runtime to update
 * the underlying {@link LoaderszLoader} without recreating the element.
 *
 * @example
 * ```html
 * <loadersz-loader state="forging" size="144" speed="1.1" theme="dark"></loadersz-loader>
 * ```
 */
export class LoaderszLoaderElement extends HTMLElement {
  private canvas: HTMLCanvasElement | null = null;
  private loader: LoaderszLoader | null = null;

  /**
   * Attributes that trigger an immediate option update when they change.
   *
   * @returns Supported HTML attribute names. `aria-label` is mirrored to the internal canvas.
   */
  static get observedAttributes(): string[] {
    return ['state', 'size', 'speed', 'theme', 'paused', 'force-motion', 'density', 'hue', 'color', 'aria-label'];
  }

  /**
   * Creates the backing canvas and controller after the element enters a document.
   *
   * @returns Nothing. Reconnecting an existing element does not create a duplicate controller.
   */
  connectedCallback(): void {
    if (this.loader) return;
    if (!this.canvas) this.canvas = document.createElement('canvas');
    this.style.display = 'inline-block';
    if (!this.canvas.isConnected) this.append(this.canvas);
    this.loader = new LoaderszLoader(this.canvas, this.readOptions());
  }

  /**
   * Stops animation and removes lifecycle listeners when the element leaves the document.
   *
   * @returns Nothing. A later reconnection creates a fresh controller from the current attributes.
   */
  disconnectedCallback(): void {
    this.loader?.destroy();
    this.loader = null;
  }

  /**
   * Converts changed attributes to typed options and forwards them to the controller.
   *
   * @param name Name of the changed observed attribute.
   * @returns Nothing. Attribute values are read from the element so removals are handled too.
   */
  attributeChangedCallback(name: string): void {
    if (name === 'aria-label' && this.canvas) this.canvas.setAttribute('aria-label', this.label);
    this.loader?.setOptions(this.readOptions());
  }

  /** Returns the accessible label attribute or the component's default label. */
  private get label(): string {
    return this.getAttribute('aria-label') || DEFAULT_OPTIONS.ariaLabel;
  }

  /**
   * Reads all supported element attributes as a complete typed option object.
   *
   * @returns Options ready for {@link LoaderszLoader}; malformed numeric values fall back to defaults.
   */
  private readOptions(): LoaderszOrbOptions {
    return {
      state: (this.getAttribute('state') || DEFAULT_OPTIONS.state) as OrbState,
      size: Number(this.getAttribute('size')) || DEFAULT_OPTIONS.size,
      speed: Number(this.getAttribute('speed')) || DEFAULT_OPTIONS.speed,
      theme: (this.getAttribute('theme') || DEFAULT_OPTIONS.theme) as OrbTheme,
      paused: this.hasAttribute('paused') && this.getAttribute('paused') !== 'false',
      forceMotion: this.hasAttribute('force-motion') && this.getAttribute('force-motion') !== 'false',
      density: Number(this.getAttribute('density')) || DEFAULT_OPTIONS.density,
      hue: this.hasAttribute('hue') ? Number(this.getAttribute('hue')) : DEFAULT_OPTIONS.hue,
      color: this.getAttribute('color') || DEFAULT_OPTIONS.color,
      ariaLabel: this.label,
    };
  }
}
