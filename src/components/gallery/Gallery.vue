<template>
  <section class="celestial-bodies-gallery" v-bind="$attrs">
    <div class="scale-container">
      <div class="scale">{{ Intl.NumberFormat().format(scale * 100) }} km</div>
      <p class="scale-disclaimer" v-if="!showScene">Distances between objects not drawn to scale</p>
    </div>
    <celestial-scene v-if="showScene" :scene="scene!.system!" :scale="scale" :showName="showNames"
      :showDiameter="showDiameters" />
    <template v-else>
      <section class="celestial-bodies" v-if="bodies.length > 0">
        <transition-group name="fade">
          <celestial-body class="celestial-body-item" v-for="body in bodies" v-bind:key="body.key" :id="body.key"
            :body="body" :scale="scale" :showName="showNames" :showDiameter="showDiameters"
            :showGroups="bodies.length == 1" />
        </transition-group>
      </section>
      <section class="empty-message" v-else>Choose which celestial bodies to display from the options.</section>
    </template>

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
        <input type="checkbox" name="show-accurate-distances" id="show-accurate-distances"
          v-model="showAccurateDistances" />
      </template>

    </sidebar-panel>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Body, Scene } from "../../data/data";
import CelestialBody from "./CelestialBody.vue";
import ExplorePanel from "./ExplorePanel.vue";
import SidebarPanel from "../sidebar/SidebarPanel.vue";
import LogSlider from "../form/LogSlider.vue";
import CelestialScene from "./Scene.vue";

const props = defineProps<{
  scene?: Scene;
  bodies: Body[]
}>();


const zoom = ref(1);
const showNames = ref(true);
const showDiameters = ref(true);
const showAccurateDistances = ref(true);

const supportsAccurateDistances = computed(() => {
  return props.scene?.system != undefined;
})
const showScene = computed(() => {
  return supportsAccurateDistances.value && showAccurateDistances.value;
})

const initialScale = computed(() => {
  if (showScene.value) {
    if (props.scene!.system!.suggested_scale) {
      return props.scene!.system!.suggested_scale / 8 / 100;
    }
    const largestDistance = Object.values(props.scene!.system!.satellites)
      .reduce((max, body) => Math.max(max, body.distance), 0)
    return largestDistance / 8 / 100;
  }

  const largestBodyRadius = props.bodies.reduce(
    (max, body) => Math.max(max, body.radius[0]),
    0
  );

  return Math.max(1, largestBodyRadius / 100);
});

const scale = computed(() =>
  Math.max(1, Math.floor((initialScale.value / zoom.value) * 10) / 10)
);
</script>

<style scoped>
.celestial-bodies-gallery {
  scroll-behavior: smooth;
  position: relative;
  overflow: auto;
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

.celestial-body-item {
  transition: all 1s;
  position: relative;
  z-index: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

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
