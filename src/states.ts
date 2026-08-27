/**
 * Enumerates the semantic state names that have individual `loadersz/<state>` entry points.
 *
 * This lightweight, side-effect-free module is useful for documentation sites, selectors and
 * other UIs that need to list the available loaders without registering the custom element.
 */
export { LOADER_STATES } from './core/state-registry';

/** Type-safe union of every semantic loader state exposed by `loadersz/<state>`. */
export type { LoaderStateName } from './core/state-registry';
