<template>
  <div class="celestial-body">
    <div class="figure">
      <div class="body"></div>
      <div v-if="body.rings" class="rings"></div>
    </div>
    <div class="labels">
      <p v-if="showName" class="name">{{ body.name }}</p>
      <p v-if="showDiameter" class="size">{{ friendlyDiameter }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import type { CelestialBodyData } from "../data/data";
import { defineComponent, PropType, computed } from "vue";
import { create as rand } from "random-seed";

function generateRandomGray(seed: string) {
  const r = rand(seed);
  const bias = 100 + r.intBetween(-30, 30);
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
    showName: {
      type: Boolean,
      default: true,
    },
    showDiameter: {
      type: Boolean,
      default: true,
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

    const ringWidth = computed(
      () => `${((props.body.rings?.radius ?? 0) * 2) / props.scale}px`
    );
    const ringColor = computed(() => props.body.rings?.color ?? "transparent");

    return {
      width,
      height,
      tilt,
      color,
      friendlyDiameter,
      ringWidth,
      ringColor,
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
  display: grid;
  justify-content: center;
  align-items: center;
  justify-items: center;
  grid-template-areas: "figure";
  transform: rotate(v-bind(tilt));
}
.body {
  grid-area: figure;
  background-color: v-bind(color);
  position: relative;
  height: v-bind(height);
  width: v-bind(width);
  border-radius: 100%;
}
.body::before {
  --equator-thickness: 1px;
  --equator-curvature: 0;
  content: "";
  display: block;
  position: absolute;
  border-bottom: var(--equator-thickness) dashed #111;
  /* border-radius: 100%; */
  width: v-bind(width);
  height: var(--equator-curvature);
  left: 0;
  top: calc(50% - var(--equator-thickness) / 2);
  opacity: 0.4;
}

.rings {
  grid-area: figure;
  height: 1px;
  border-radius: 1px;
  width: v-bind(ringWidth);
  background: v-bind(ringColor);
  opacity: 0.5;
  z-index: -1;
}

p {
  margin: 0;
  white-space: nowrap;
}

.labels {
  margin-top: 1em;
  text-align: center;
}
.size {
  font-size: 0.8em;
  opacity: 0.5;
}
</style>