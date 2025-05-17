<template>
  <section id="sidebar">
    <router-link to="/" class="title"><h1>The Size of Planets</h1></router-link>
    <p>A tool for comparing the sizes of celestial bodies in the solar system.</p>
    <app-footer id="footer" />
  </section>
  <router-view id="main" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppFooter from "./components/Footer.vue";

export default defineComponent({
  name: "App",
  components: {
    AppFooter,
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

option,
optgroup {
  color: #ddd;
  background: #444;
}

optgroup {
  font-style: normal;
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
#main {
  grid-area: gallery;
  height: 100%;
  width: 100%;
}
#sidebar {
  width: 25em;
  padding: 1em;
  grid-area: controls;
  background: #151516;
  overflow: auto;
  padding: 1em;
  padding-top: 2em;
  display: flex;
  gap: 1em;
  flex-direction: column;
  justify-content: start;
}
#footer {
  order: 1;
}

.title {
  text-decoration: none;
  color: inherit;
}
.title h1 {
  margin: 0;
}

@media all and (max-width: 60em) {
  #app {
    grid-template-columns: 1fr;
    grid-template-areas: "gallery" "controls";
    max-height: unset;
    height: unset;
    overflow: initial;
  }
  #sidebar {
    width: 100%;
    height: auto;
    overflow: initial;
  }
}
</style>
