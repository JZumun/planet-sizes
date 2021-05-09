<template>
  <section id="controls">
    <h1 class="title">The Size of Planets</h1>
    <p>
      A tool for comparing the sizes of celestial bodies in the solar system.
    </p>
    <fieldset>
      <legend>Celestial Bodies</legend>
      <celestial-body-picker v-model="displayedBodies" />
    </fieldset>

    <fieldset class="view-controls">
      <legend>View Controls</legend>
      <label for="zoom">Zoom</label>
      <log-slider
        class="field"
        id="zoom"
        v-model="zoom"
        :min="1 / 10"
        :max="10"
      />
      <label for="show-names">Show Names</label>
      <input
        type="checkbox"
        name="show-names"
        id="show-names"
        v-model="showNames"
      />
      <label for="show-diameters">Show Diameters</label>
      <input
        type="checkbox"
        name="show-diameters"
        id="show-diameters"
        v-model="showDiameters"
      />
    </fieldset>
  </section>
  <celestial-bodies
    id="gallery"
    :bodies="displayedBodies"
    :zoom="zoom"
    :showNames="showNames"
    :showDiameters="showDiameters"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CelestialBodies from "./components/CelestialGallery.vue";
import LogSlider from "./components/form/LogSlider.vue";
import CelestialBodyPicker from "./components/CelestialBodyPicker.vue";
import { CelestialBodyData } from "./data/data";

export default defineComponent({
  name: "App",
  components: {
    CelestialBodies,
    CelestialBodyPicker,
    LogSlider,
  },
  setup() {
    const displayedBodies = ref<CelestialBodyData[]>([]);

    const zoom = ref(1);
    const showNames = ref(true);
    const showDiameters = ref(true);
    return {
      displayedBodies,
      zoom,
      showNames,
      showDiameters,
    };
  },
});
</script>

<style>
*,
*::after,
*::before {
  box-sizing: border-box;
}
body {
  /* background: #0c1019; */
  background: #111;
  color: #ddd;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

/* Firefox */
* {
  scrollbar-width: auto;
  scrollbar-color: #444 transparent;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 16px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 10px;
  border: 3px solid #111;
}

fieldset {
  border-color: #333;
  margin-top: 1em;
  padding: 1em;
}

input {
  border: 0;
  color: inherit;
  border-bottom: 2px solid;
  background: transparent;
  padding: 0.5em;
}

button {
  padding: 0.5em 1em;
  border: none;
  background: #222;
  color: inherit;
  cursor: pointer;
}

#app {
  display: grid;
  grid-template-areas: "controls gallery";
  grid-template-columns: auto 1fr;
  height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}
#gallery {
  grid-area: gallery;
  height: 100%;
  width: 100%;
}
#controls {
  width: 25em;
  padding: 1em;
  grid-area: controls;
  background: #151516;
  overflow: auto;
}

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
