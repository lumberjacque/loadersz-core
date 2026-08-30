import { Directive, HostBinding, Input } from '@angular/core';

import type { LoaderszOrbOptions } from '../core/types';

type BooleanAttributeInput = boolean | '' | null | undefined;

/** Converts Angular boolean input values into native boolean attribute values. */
function toBooleanAttribute(value: BooleanAttributeInput): '' | null {
  return value === true || value === '' ? '' : null;
}

/**
 * Angular's standalone directive for the native `<loadersz-loader>` element.
 *
 * Add this directive to a standalone component's `imports` array. Angular then
 * recognises the custom element without `CUSTOM_ELEMENTS_SCHEMA`. Import a
 * loader runtime separately (`loadersz` or a direct state entry) to register
 * the native element and select the desired bundle size.
 *
 * @example
 * ```ts
 * import { Component } from '@angular/core';
 * import 'loadersz';
 * import { LoaderszLoader } from 'loadersz/angular';
 *
 * @Component({
 *   standalone: true,
 *   imports: [LoaderszLoader],
 *   template: `<loadersz-loader [state]="state" [size]="96" />`,
 * })
 * export class LoadingComponent {
 *   readonly state = 'racing' as const;
 * }
 * ```
 */
@Directive({
  selector: 'loadersz-loader',
  standalone: true,
})
export class LoaderszLoader {
  /** Visual state to render. Bind with `[state]` to change it reactively. */
  @Input() @HostBinding('attr.state') state?: LoaderszOrbOptions['state'];

  /** Square canvas side in CSS pixels. Bind with `[size]`. */
  @Input() @HostBinding('attr.size') size?: number;

  /** Animation timeline multiplier. Bind with `[speed]`. */
  @Input() @HostBinding('attr.speed') speed?: number;

  /** Geometry-detail multiplier. Bind with `[density]`. */
  @Input() @HostBinding('attr.density') density?: number;

  /** Particle radius multiplier from `0.5` to `2.5`. Bind with `[particleRadius]`. */
  @Input() @HostBinding('attr.particle-radius') particleRadius?: number;

  /** Native palette override from 0 to 360. Bind with `[hue]`. */
  @Input() @HostBinding('attr.hue') hue?: number;

  /** Exact CSS colour, including CSS variables. Bind with `[color]`. */
  @Input() @HostBinding('attr.color') color?: string;

  private paletteAttribute: string | null = null;

  /** Ordered CSS colours. Bind with `[palette]`; the directive serializes the native semicolon attribute. */
  @Input()
  set palette(value: LoaderszOrbOptions['palette']) {
    this.paletteAttribute =
      value
        ?.map((color) => color.trim())
        .filter(Boolean)
        .slice(0, 8)
        .join('; ') || null;
  }

  /** Serialized native attribute kept separate from the typed array input. */
  @HostBinding('attr.palette')
  get nativePalette(): string | null {
    return this.paletteAttribute;
  }

  /** Canvas theme: `auto`, `light`, or `dark`. Bind with `[theme]`. */
  @Input() @HostBinding('attr.theme') theme?: LoaderszOrbOptions['theme'];

  /** Accessible description forwarded to the native `aria-label` attribute. */
  @Input() @HostBinding('attr.aria-label') ariaLabel?: string;

  private pausedAttribute: '' | null = null;
  private forceMotionAttribute: '' | null = null;

  /** Stops animation scheduling when true; use `[paused]` for dynamic values. */
  @Input()
  @HostBinding('attr.paused')
  set paused(value: BooleanAttributeInput) {
    this.pausedAttribute = toBooleanAttribute(value);
  }

  /** Keeps animation enabled when reduced motion is preferred; bind with `[forceMotion]`. */
  @Input()
  @HostBinding('attr.force-motion')
  set forceMotion(value: BooleanAttributeInput) {
    this.forceMotionAttribute = toBooleanAttribute(value);
  }
}
