<template>
  <section class="celestial-bodies-gallery">
    <div class="scale">{{ Intl.NumberFormat().format(scale * 100) }} km</div>
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
    <section class="empty-message" v-else>
      Choose which celestial bodies to display from the options.
    </section>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { CelestialBodyData } from "../data/data";
import LogSlider from "./form/LogSlider.vue";
import CelestialBody from "./CelestialBody.vue";

export default defineComponent({
  components: {
    CelestialBody,
    LogSlider,
  },
  props: {
    bodies: {
      type: Array as PropType<CelestialBodyData[]>,
      required: true,
    },
    zoom: {
      type: Number,
      default: 1,
    },
    showNames: {
      type: Boolean,
      default: true,
    },
    showDiameters: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const initialScale = computed(() => {
      const largestBodyRadius = props.bodies.reduce(
        (max, body) => Math.max(max, body.radius[0]),
        0
      );

      return Math.max(1, largestBodyRadius / 200);
    });

    const scale = computed(
      () => Math.floor((initialScale.value / props.zoom) * 10) / 10
    );

    return {
      initialScale,
      scale,
    };
  },
});
</script>

<style scoped>
.celestial-bodies-gallery {
  position: relative;
  overflow: auto;
  padding: 5em;
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
}

.scale {
  padding: 2em;
  position: fixed;
  bottom: 20px;
  right: 20px;
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
</style>
