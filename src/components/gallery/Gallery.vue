<template>
  <section
    class="celestial-bodies-gallery"
    :class="{ 'accurate-distance': showDistance }"
    v-bind="$attrs"
    ref="main"
    @wheel.prevent="handleWheel"
    :style="`--scale: ${scale};`"
  >
    <h2 class="title" v-html="title"></h2>
    <ul class="distance-list" :style="`--margin: ${initialMargin};`">
      <template v-if="showDistance">
        <li
          v-for="({ distance }, moon) in scene?.system?.satellites"
          :key="moon"
          :style="`--distance: ${distance}; --color: ${bodyMap[moon].color}`"
        >
          <span>{{ bodyMap[moon].name }} ({{ fmtDistance(distance) }} km)</span>
        </li>
      </template>
    </ul>
    <section class="celestial-bodies" ref="bodies">
      <transition-group name="fade">
        <div
          class="celestial-body-container"
          v-for="{ body, distance } in display"
          v-bind:key="body.key"
          :style="`--distance: ${distance}`"
        >
          <celestial-body
            class="celestial-body-item"
            :id="body.key"
            :body="body"
            :scale="scale"
            :showName="showNames"
            :showDiameter="showDiameters"
            :showGroups="bodies.length == 1"
          />
        </div>
      </transition-group>
    </section>
    <div class="scale-container">
      <div class="scale">{{ fmtDistance(Math.round(50 * scale)) }} km</div>
      <p class="scale-disclaimer" v-if="!showDistance">Distances between objects not drawn to scale</p>
    </div>
  </section>
  <teleport to="#sidebar">
    <explore-panel :scene="scene?.key" :bodies="bodies" />
    <sidebar-panel name="View Controls">
      <label for="zoom">Zoom</label>
      <log-slider class="field" id="zoom" v-model="zoom" :min="1 / 10" :max="10" />

      <label for="show-names">Show Names</label>
      <input type="checkbox" name="show-names" id="show-names" v-model="showNames" />

      <label for="show-diameters">Show Diameters</label>
      <input type="checkbox" name="show-diameters" id="show-diameters" v-model="showDiameters" />

      <template v-if="supportsAccurateDistances">
        <label for="show-accurate-distances">Show Accurate Distances <span class="tag">(experimental)</span></label>
        <input
          type="checkbox"
          name="show-accurate-distances"
          id="show-accurate-distances"
          v-model="showAccurateDistances"
        />
      </template>
    </sidebar-panel>
  </teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch, watchEffect } from "vue";
import { useElementSize, useWindowSize } from "@vueuse/core";
import { Body, Scene, bodies as bodyMap } from "../../data/data";
import CelestialBody from "./CelestialBody.vue";
import ExplorePanel from "./ExplorePanel.vue";
import SidebarPanel from "../sidebar/SidebarPanel.vue";
import LogSlider from "../form/LogSlider.vue";

const props = defineProps<{
  scene?: Scene;
  bodies: Body[];
}>();

const zoom = ref(1);
const showNames = ref(true);
const showDiameters = ref(true);
const showAccurateDistances = ref(true);

const supportsAccurateDistances = computed(() => {
  return props.scene?.system != undefined;
});
const showDistance = computed(() => {
  return supportsAccurateDistances.value && showAccurateDistances.value;
});

const galleryRef = useTemplateRef("main");

// TITLE
const title = computed(() => props.scene?.name ?? "&nbsp;");

// SCALE
const { width: galleryWidth } = useElementSize(galleryRef);
const { width: windowWidth } = useWindowSize();
const padding = computed(() => (windowWidth.value > 60 * 16 ? 100 : 32));
const galleryEffectiveWidth = computed(() => galleryWidth.value - padding.value * 2);
const sceneSize = computed(() => {
  if (showDistance.value) {
    const system = props.scene!.system!;
    if (system.suggested_scale) {
      return system.suggested_scale + bodyMap[system.main].radius[0] * 2;
    }
    const largestDistance =
      Object.entries(system.satellites).reduce(
        (max, [key, body]) => Math.max(max, body.distance + bodyMap[key].radius[0]),
        0
      ) + bodyMap[system.main].radius[0];
    return largestDistance;
  }

  const largestBodyRadius = props.bodies.reduce((max, body) => Math.max(max, body.radius[0]), 0);

  return Math.max(1, largestBodyRadius * 2 * Math.min(props.bodies.length + 2, 5));
});

const scale = computed(() => {
  const s = Math.floor((sceneSize.value / zoom.value / galleryEffectiveWidth.value) * 10) / 10;
  if (s === 0) {
    return 100;
  }
  return s;
});
const fmtDistance = Intl.NumberFormat().format;

// BODIES ON DISPLAY
const initialMargin = computed(() => props.bodies[0].radius[0]);
const display = ref<
  {
    body: Body;
    distance: number;
  }[]
>([]);
const updateDisplay = () => {
  // simple list of bodies
  if (!showDistance.value) {
    display.value = props.bodies.map((b, i) => ({
      body: b,
      distance: b.radius[0] + (props.bodies[i - 1]?.radius?.[0] ?? 0),
    }));
    return;
  }

  // system with accurate dustances
  const system = props.scene!.system!;
  const main = bodyMap[system.main];

  let previousDistance = 0;
  display.value = [
    {
      body: { ...main, tilt: 0 },
      distance: initialMargin.value,
    },
    ...Object.entries(system.satellites).map(([key, info]) => {
      const distance = info.distance - previousDistance;
      previousDistance = info.distance;
      return {
        body: bodyMap[key],
        distance: distance,
      };
    }),
  ];
};
watch(props, updateDisplay);
onMounted(updateDisplay);

// WHEEL BEHAVIOR
function handleWheel(e: WheelEvent) {
  const item = galleryRef.value;
  if (item == null) return;

  if (e.ctrlKey) {
    // ZOOM
    if (e.deltaY > 0) zoom.value = Math.min(10, zoom.value * 1.5);
    else zoom.value = Math.max(1 / 10, zoom.value / 1.5);
  } else {
    // SCROLL
    if (e.deltaY > 0) item.scrollLeft! += 200;
    else item.scrollLeft -= 200;
  }
}
</script>

<style scoped>
.celestial-bodies-gallery {
  scroll-behavior: smooth;
  position: relative;
  overflow: auto;

  background-size: 50px 50px;
  --grid-line-color: #151515;
  background-image: linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px);
  --gallery-padding: 100px;

  display: grid;
  grid-template-rows: auto auto 1fr;
}

.title {
  font-size: 1em;
  margin: 2em var(--gallery-padding);
  color: #999;
  justify-self: start;
  position: sticky;
  left: var(--gallery-padding);
}

.empty-message {
  display: grid;
  align-items: center;
  text-align: center;
  height: 100%;
}

.celestial-bodies {
  width: min-content;
  max-width: calc(100% - 2 * var(--gallery-padding));
  max-height: calc(100% - 5em);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  flex: 1;
  margin: auto;
  position: relative;
  z-index: 2;
}

.tag {
  display: inline-block;
  font-size: 0.5em;
  opacity: 0.5;
}

.scale-container {
  padding: 2em;
  position: fixed;
  bottom: 2em;
  right: 2em;
  z-index: 10;
  text-align: right;
  z-index: 0;
}

.scale::before {
  content: "";
  display: inline-block;
  width: 50px;
  height: 5px;
  border: 1px solid white;
  border-top: 0;
  margin-right: 5px;
}

.scale-disclaimer {
  color: #444;
  font-size: 0.75em;
}

.accurate-distance .celestial-bodies {
  margin-left: var(--gallery-padding);
  gap: 0;
}
.accurate-distance .celestial-body-container {
  width: 0;
  margin-left: calc(var(--distance) / var(--scale) * 1px);
}
.celestial-body-container {
  will-change: width, margin-left, opacity, transform, height;
  transition: width 1s, margin-left 1s, opacity 1s, transform 1s, height 1s;
  position: relative;
  z-index: 1;
  margin-left: 0;
  width: auto;
  width: calc-size(auto, size);
}

.distance-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75em;
  padding: 0;
  padding-left: var(--gallery-padding);
  margin-left: calc(var(--margin) / var(--scale) * 1px);
  transition: opacity 1s, transform 1s, margin 1s, height 1s;

  li {
    list-style-type: none;
    opacity: 0.5;
    font-size: 0.8em;
    position: relative;
    width: fit-content;

    span {
      opacity: 0.75;
      position: sticky;
      left: var(--gallery-padding);
    }

    &::after {
      content: "";
      display: block;
      width: calc(var(--distance) / var(--scale) * 1px);
      height: 5px;
      border: 1px solid;
      border-bottom: 0px;
      border-color: var(--color);
      transition: width 1s;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-from :deep(.body),
.fade-leave-to :deep(.body) {
  height: 0;
  width: 0;
}

.fade-leave-active {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

@media all and (max-width: 60em) {
  .celestial-bodies-gallery {
    --gallery-padding: 2em;
  }
  .celestial-bodies {
    max-height: initial;
    margin-top: 5em;
    margin-bottom: 2em;
  }

  .scale-container {
    position: sticky;
    right: 0;
    bottom: 0;
    justify-self: start;
    margin-left: auto;
    padding: 1em;
  }
}
</style>
