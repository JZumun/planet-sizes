<template>
  <section class="celestial-bodies-gallery" v-bind="$attrs" ref="main" @wheel.prevent="handleWheel">
    <div class="scale-container">
      <div class="scale">{{ Intl.NumberFormat().format(scale * 100) }} km</div>
      <p class="scale-disclaimer" v-if="!showDistance">Distances between objects not drawn to scale</p>
    </div>

    <section class="celestial-bodies" :class="{ 'accurate-distance': showDistance }" v-if="display.length > 0">
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
    <section class="empty-message" v-else>Choose which celestial bodies to display from the options.</section>
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
import { computed, ref, useTemplateRef } from "vue";
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

// SCALE
const initialScale = computed(() => {
  if (showDistance.value) {
    if (props.scene!.system!.suggested_scale) {
      return props.scene!.system!.suggested_scale / 7 / 100;
    }
    const largestDistance = Object.values(props.scene!.system!.satellites).reduce(
      (max, body) => Math.max(max, body.distance),
      0
    );
    return largestDistance / 7 / 100;
  }

  const largestBodyRadius = props.bodies.reduce((max, body) => Math.max(max, body.radius[0]), 0);

  return Math.max(1, largestBodyRadius / 100);
});

const scale = computed(() => Math.max(1, Math.floor((initialScale.value / zoom.value) * 10) / 10));

// BODIES ON DISPLAY
const display = computed(() => {
  // simple list of bodies
  if (!showDistance.value) {
    return props.bodies.map((b, i) => ({
      body: b,
      distance: (b.radius[0] + (props.bodies[i - 1]?.radius?.[0] ?? 0)) / scale.value,
    }));
  }

  // system with accurate dustances
  const system = props.scene!.system!;
  const main = bodyMap[system.main];

  let previousDistance = 0;
  return [
    {
      body: { ...main, tilt: 0 },
      distance: main.radius[0] / scale.value,
    },
    ...Object.entries(system.satellites).map(([key, info]) => {
      const distance = info.distance - previousDistance;
      previousDistance = info.distance;
      return {
        body: bodyMap[key],
        distance: distance / scale.value,
      };
    }),
  ];
});

// WHEEL BEHAVIOR
const galleryRef = useTemplateRef("main");
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

  background-size: 100px 100px;
  --grid-line-color: #151515;
  background-image: linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px);
}

.empty-message {
  display: grid;
  align-items: center;
  text-align: center;
  height: 100%;
}

.celestial-bodies {
  height: 100%;
  width: min-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  flex: 1;
  margin: auto;
  padding: 5em;
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
  width: 100px;
  height: 5px;
  border: 1px solid white;
  border-top: 0;
  margin-right: 5px;
}

.scale-disclaimer {
  color: #444;
  font-size: 0.75em;
}

.accurate-distance .celestial-body-container {
  width: 0;
  margin-left: calc(var(--distance) * 1px);
}
.celestial-body-container {
  will-change: width, margin-left, opacity, transform, height;
  transition: width 1s, margin-left 1s, opacity 1s, transform 1s, height 1s;
  position: relative;
  z-index: 1;
  margin-left: 0;
  width: calc-size(auto, size);
  width: auto;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-form :deep(.body),
.fade-leave-to :deep(.body) {
  height: 0;
  width: 0;
}

.fade-leave-active {
  position: absolute;
  z-index: -1;
}

@media all and (max-width: 60em) {
  .celestial-bodies {
    height: initial;
  }
  .scale-container {
    position: sticky;
    top: 0;
    left: 0;
    /* height: 0; */
  }
}
</style>
