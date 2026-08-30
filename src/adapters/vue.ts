import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';

import { registerLoadersz } from '../loadersz';
import type { LoaderszOrbOptions, OrbState, OrbTheme } from '../core/types';

registerLoadersz();

/**
 * Typed Vue 3 wrapper around `<loadersz-loader>`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { LoaderszLoader } from 'loadersz/vue';
 * </script>
 *
 * <template><LoaderszLoader state="forging" :size="160" /></template>
 * ```
 */
export const LoaderszLoader = defineComponent({
  name: 'LoaderszLoader',
  inheritAttrs: false,
  props: {
    state: String as PropType<OrbState>,
    size: Number,
    speed: Number,
    density: Number,
    particleRadius: Number,
    hue: Number,
    color: String,
    palette: Array as PropType<LoaderszOrbOptions['palette']>,
    theme: String as PropType<OrbTheme>,
    paused: Boolean,
    forceMotion: Boolean,
    ariaLabel: String,
  },
  setup(props, { attrs }) {
    return () =>
      h('loadersz-loader', {
        ...attrs,
        state: props.state,
        size: props.size,
        speed: props.speed,
        density: props.density,
        'particle-radius': props.particleRadius,
        hue: props.hue,
        color: props.color,
        palette: props.palette?.join('; '),
        theme: props.theme,
        paused: props.paused ? '' : undefined,
        'force-motion': props.forceMotion ? '' : undefined,
        'aria-label': props.ariaLabel,
      });
  },
});
