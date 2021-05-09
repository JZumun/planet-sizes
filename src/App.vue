<template>
  <section id="controls">
    <h1 class="title">The Size of Planets</h1>
    <p>
      A tool for comparing the sizes of celestial bodies in the solar system.
    </p>

    <section class="options" @submit.prevent>
      <label for="presets">Presets</label>
      <div class="field button-field" id="presets">
        <button
          v-for="group in groups"
          :key="group.key"
          @click.prevent="set(...group.includes)"
        >
          {{ group.name }}
        </button>
      </div>
      <label for="bodies">Add: </label>
      <input
        class="field"
        type="search"
        id="bodies"
        list="body-list"
        v-model.lazy="additionalBody"
      />
      <datalist id="body-list">
        <option v-for="body in bodies" :key="body.key" :value="body.key">
          {{ body.name }}
        </option>
      </datalist>

      <div class="field">
        <div class="body-tag" v-for="body in displayedBodies" :key="body.key">
          {{ body.name }}
          <button class="remove" @click.prevent="remove(body.key)">✕</button>
        </div>
      </div>
      <button class="field" @click.prevent="set()">Clear</button>

      <label for="zoom">Zoom</label>
      <log-slider
        class="field"
        id="zoom"
        v-model="zoom"
        :min="1 / 10"
        :max="10"
      />
    </section>
  </section>
  <celestial-bodies id="gallery" :bodies="displayedBodies" :zoom="zoom" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import CelestialBodies from "./components/CelestialGallery.vue";
import LogSlider from "./components/form/LogSlider.vue";
import { bodies, CelestialBodyData, groups } from "./data/data";

export default defineComponent({
  name: "App",
  components: {
    CelestialBodies,
    LogSlider,
  },
  setup() {
    const displayedBodies = ref<CelestialBodyData[]>([]);
    const remove = (key: string) => {
      displayedBodies.value = displayedBodies.value.filter(
        (body) => body.key !== key
      );
    };
    const add = (key: string) => {
      if (key in bodies) {
        remove(key);
        displayedBodies.value.push(bodies[key]);
      }
    };
    const set = (...keys: string[]) => {
      console.log("why");
      displayedBodies.value = keys.map((k) => bodies[k]);
    };
    set(...groups["solar-system"].includes);

    const additionalBody = ref<string>("");
    watch(additionalBody, () => {
      if (additionalBody.value in bodies) {
        console.log(`hello ${additionalBody.value}`);
        add(additionalBody.value);
      }
      additionalBody.value = "";
    });

    const zoom = ref(1);
    return {
      bodies: Object.values(bodies),
      groups: Object.values(groups),
      additionalBody,
      displayedBodies,
      zoom,
      remove,
      set,
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

button {
  padding: 0.5em 1em;
  border: none;
  background: #222;
  color: white;
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
}

.options {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1em;
}

.options > label {
  grid-column: 1;
}

.options > .field {
  grid-column: 2;
}

.body-tag {
  display: inline-block;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.5em;
  background: #222;
}
.body-tag > .remove {
  background: none;
  padding: 0;
}

.button-field {
  display: flex;
  gap: 0.25em;
  flex-wrap: wrap;
}

input {
  border: 0;
  color: inherit;
  border-bottom: 2px solid;
  background: transparent;
  padding: 0.5em;
}
</style>
