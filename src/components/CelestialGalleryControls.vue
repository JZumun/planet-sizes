<template>
  <fieldset class="view-controls">
    <legend>View Controls</legend>
    <label for="zoom">Zoom</label>
    <log-slider class="field" id="zoom" v-model="zoomRef" :min="1 / 10" :max="10" />
    <label for="show-names">Show Names</label>
    <input type="checkbox" name="show-names" id="show-names" v-model="showNamesRef" />
    <label for="show-diameters">Show Diameters</label>
    <input type="checkbox" name="show-diameters" id="show-diameters" v-model="showDiametersRef" />
  </fieldset>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import LogSlider from "./form/LogSlider.vue";

export default defineComponent({
  components: {
    LogSlider,
  },
  props: {
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
  emits: ["update:zoom", "update:showNames", "update:showDiameters"],
  setup(props, { emit }) {
    const propToModel = <K extends keyof typeof props>(name: K) =>
      computed({
        get: () => props[name],
        set: (val) => emit(`update:${name}` as `update:${typeof name}`, val),
      });

    const zoomRef = propToModel("zoom");
    const showNamesRef = propToModel("showNames");
    const showDiametersRef = propToModel("showDiameters");

    return {
      zoomRef,
      showNamesRef,
      showDiametersRef,
    };
  },
});
</script>


<style scoped>
.view-controls {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1em;
  align-items: center;
}

.view-controls > label {
  grid-column: 1;
}

.view-controls > .field {
  grid-column: 2;
}
</style>