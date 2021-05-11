<template>
  <section id="controls">
    <h1 class="title">The Size of Planets</h1>
    <p>A tool for comparing the sizes of celestial bodies in the solar system.</p>
    <fieldset>
      <legend>Explore</legend>
      <celestial-body-picker v-model="displayedBodies" />
    </fieldset>
    <app-footer id="footer" />
  </section>
  <celestial-bodies id="gallery" :bodies="displayedBodies" @go="setGroup" />
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import AppFooter from "./components/Footer.vue";
import CelestialBodies from "./components/CelestialGallery.vue";
import CelestialBodyPicker from "./components/CelestialBodyPicker.vue";
import { CelestialBodyData, bodies, groups } from "./data/data";
import { list } from "./utilities/text";

const QKEY = "i";
const GKEY = "g";
const SEPARATOR = " ";
function updateQueryParameters(bodies: CelestialBodyData[]) {
  const params = new URLSearchParams();
  params.set(QKEY, bodies.map((b) => b.key).join(SEPARATOR));
  history.replaceState(null, (null as any) as string, `?${params.toString()}`);
}

function retrieveFromQueryParameters() {
  const params = new URLSearchParams(window.location.search);
  const values = params.get(QKEY);
  if (values) {
    return values
      .split(SEPARATOR)
      .map((k) => bodies[k])
      .filter((b) => b);
  }

  const preset = params.get(GKEY);
  if (preset && preset in groups) {
    return groups[preset].includes.map((k) => bodies[k]);
  }

  return [];
}

const BASE_TITLE = "The Size of Planets";
function updateTitle(bodies: CelestialBodyData[]) {
  window.document.title =
    bodies.length == 0
      ? BASE_TITLE
      : `${BASE_TITLE} - ${list(bodies.map((b) => b.name))}`;
}

export default defineComponent({
  name: "App",
  components: {
    AppFooter,
    CelestialBodies,
    CelestialBodyPicker,
  },
  setup() {
    const displayedBodies = ref<CelestialBodyData[]>(
      retrieveFromQueryParameters()
    );

    watchEffect(() => {
      updateQueryParameters(displayedBodies.value ?? []);
      updateTitle(displayedBodies.value ?? []);
    });

    const setGroup = (group: string) => {
      displayedBodies.value = groups[group].includes.map((k) => bodies[k]);
    };

    return {
      displayedBodies,
      setGroup,
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

input,
select {
  border: 0;
  color: inherit;
  background: transparent;
  padding: 0.5em;
  vertical-align: middle;
}

input[type="search"],
select {
  border: 1px solid #222;
}

option {
  color: #ddd;
  background: #444;
}

select:invalid,
select option[value=""] {
  color: #666;
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
#footer {
  order: 1;
}

.title {
  margin: 0;
}
</style>
