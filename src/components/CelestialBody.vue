<template>
  <div class="celestial-body">
    <div class="figure"></div>
    <p class="label">
      {{ body.name }}
    </p>
    <p class="size">{{ friendlyDiameter }}</p>
  </div>
</template>

<script lang="ts">
import type { CelestialBodyData } from "../data/data";
import { defineComponent, PropType, computed, ComputedRef } from "vue";
import { create as rand, RandomSeed } from "random-seed";

function generateRandomGray(seed: string) {
  const r = rand(seed);
  const bias = 64 + r.intBetween(-30, 30);
  function generateGrayComponent() {
    return (r.intBetween(-4, 4) + bias).toString(16);
  }

  const red = generateGrayComponent();
  const green = generateGrayComponent();
  const blue = generateGrayComponent();
  return `#${red}${green}${blue}`;
}

export default defineComponent({
  props: {
    body: {
      type: Object as PropType<CelestialBodyData>,
      required: true,
    },
    scale: {
      required: true,
      type: Number,
    },
  },
  setup(props) {
    const width = computed(
      () => `${(props.body.radius[0] * 2) / props.scale}px`
    );
    const height = computed(() =>
      props.body.radius[1]
        ? `${(props.body.radius[1] * 2) / props.scale}px`
        : width.value
    );

    const tilt = computed(() => `${props.body.tilt ?? 0}deg`);
    const color = computed(
      () => props.body.color ?? generateRandomGray(props.body.key)
    );

    const friendlyDiameter = computed(
      () =>
        `${Intl.NumberFormat().format(Math.floor(props.body.radius[0] * 2))} km`
    );

    return {
      width,
      height,
      tilt,
      color,
      friendlyDiameter,
    };
  },
});
</script>

<style scoped>
.celestial-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}
.figure {
  background-color: v-bind(color);
  position: relative;
  height: v-bind(height);
  width: v-bind(width);
  transform: rotate(v-bind(tilt));
  border-radius: 100%;
  z-index: 0;
  overflow: hidden;
}
.figure::before {
  --equator-thickness: 1px;
  content: "";
  display: block;
  position: absolute;
  border: var(--equator-thickness) dashed #111;
  width: v-bind(width);
  height: 0;
  left: 0;
  top: calc(50% - var(--equator-thickness));
  z-index: -1;
  opacity: 0.4;
}

p {
  margin: 0;
}

.label {
  margin-top: 1em;
}
.size {
  font-size: 0.8em;
  opacity: 0.5;
  margin-top: 0;
}
</style>