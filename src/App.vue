<template>
  <section id="controls">
    <h1 class="title">The Size of Planets</h1>
    <p>A tool for comparing the sizes of celestial bodies in the solar system.</p>
    <fieldset>
      <legend>Explore</legend>
      <celestial-body-picker v-model="displayedBodies" />
    </fieldset>

    <fieldset class="view-controls">
      <legend>View Controls</legend>
      <label for="zoom">Zoom</label>
      <log-slider class="field" id="zoom" v-model="zoom" :min="1 / 10" :max="10" />
      <label for="show-names">Show Names</label>
      <input type="checkbox" name="show-names" id="show-names" v-model="showNames" />
      <label for="show-diameters">Show Diameters</label>
      <input type="checkbox" name="show-diameters" id="show-diameters" v-model="showDiameters" />
    </fieldset>
    <app-footer />
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
import { defineComponent, ref, watch } from "vue";
import AppFooter from "./components/Footer.vue";
import CelestialBodies from "./components/CelestialGallery.vue";
import LogSlider from "./components/form/LogSlider.vue";
import CelestialBodyPicker from "./components/CelestialBodyPicker.vue";
import { CelestialBodyData, bodies } from "./data/data";

const QKEY = "i";
const SEPARATOR = " ";
function updateQueryParameters(bodies: CelestialBodyData[]) {
  const params = new URLSearchParams();
  params.set(QKEY, bodies.map((b) => b.key).join(SEPARATOR));
  history.replaceState(null, (null as any) as string, `?${params.toString()}`);
}

function retrieveFromQueryParameters() {
  const params = new URLSearchParams(window.location.search);
  const values = params.get(QKEY);
  return values?.split(SEPARATOR) ?? [];
}

export default defineComponent({
  name: "App",
  components: {
    AppFooter,
    CelestialBodies,
    CelestialBodyPicker,
    LogSlider,
  },
  setup() {
    const displayedBodies = ref<CelestialBodyData[]>(
      retrieveFromQueryParameters()
        .map((k) => bodies[k])
        .filter((b) => b)
    );

    watch(displayedBodies, () => {
      updateQueryParameters(displayedBodies.value ?? []);
    });

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
  margin: 0;
  margin-top: 1em;
  padding: 1em;
}

input {
  border: 0;
  color: inherit;
  background: transparent;
  padding: 0.5em;
  vertical-align: middle;
}

input[type="search"] {
  border: 1px solid #222;
}

::placeholder {
  color: #999;
}

button {
  padding: 0.5em 1em;
  border: none;
  background: #222;
  font: inherit;
  font-size: 0.8em;
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
  padding: 1em;
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.title {
  margin: 0;
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
