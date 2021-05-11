<template>
  <section class="celestial-bodies-gallery" v-bind="$attrs">
    <div class="scale-container">
      <div class="scale">{{ Intl.NumberFormat().format(scale * 100) }} km</div>
      <p class="scale-disclaimer">Distances between objects not drawn to scale</p>
    </div>
    <section class="celestial-bodies" v-if="bodies.length > 0">
      <celestial-body
        v-for="body in bodies"
        v-bind:key="body.key"
        :body="body"
        :scale="scale"
        :showName="showNames"
        :showDiameter="showDiameters"
      />
    </section>
    <section class="empty-message" v-else>Choose which celestial bodies to display from the options.</section>
  </section>
  <teleport to="#controls">
    <celestial-gallery-controls
      v-model:zoom="zoom"
      v-model:showNames="showNames"
      v-model:show-diameters="showDiameters"
    />
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { CelestialBodyData } from "../data/data";
import CelestialBody from "./CelestialBody.vue";
import CelestialGalleryControls from "./CelestialGalleryControls.vue";

export default defineComponent({
  components: {
    CelestialBody,
    CelestialGalleryControls,
  },
  props: {
    bodies: {
      type: Array as PropType<CelestialBodyData[]>,
      required: true,
    },
  },
  setup(props) {
    const zoom = ref(1);
    const showNames = ref(true);
    const showDiameters = ref(true);

    const initialScale = computed(() => {
      const largestBodyRadius = props.bodies.reduce(
        (max, body) => Math.max(max, body.radius[0]),
        0
      );

      return Math.max(1, largestBodyRadius / 100);
    });

    const scale = computed(
      () => Math.floor((initialScale.value / zoom.value) * 10) / 10
    );

    return {
      zoom,
      showNames,
      showDiameters,
      scale,
    };
  },
});
</script>

<style scoped>
.celestial-bodies-gallery {
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
}

.scale-container {
  padding: 2em;
  position: fixed;
  bottom: 2em;
  right: 2em;
  z-index: 10;
  text-align: right;
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
</style>
