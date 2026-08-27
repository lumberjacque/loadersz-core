import { CanvasLoader } from './CanvasLoader';
import { buildFrame } from './modes';
import { resolveMode } from './options';
import type { LoaderszOrbOptions } from './types';

/**
 * Imperative Canvas controller for a state-switchable loadersz animation.
 *
 * @example
 * ```ts
 * const loader = new LoaderszLoader(canvas, { state: 'searching', size: 144 });
 * loader.setOptions({ state: 'solving', speed: 1.2 });
 * ```
 */
export class LoaderszLoader extends CanvasLoader {
  /**
   * Creates a loader that can switch between every bundled semantic state.
   *
   * @param canvas Canvas element to own.
   * @param options Initial visual and accessibility options.
   * @throws {Error} When the browser cannot create a 2D canvas context.
   */
  constructor(canvas: HTMLCanvasElement, options: LoaderszOrbOptions = {}) {
    super(canvas, options, (context, currentOptions) => buildFrame(resolveMode(currentOptions.state), context));
  }
}
