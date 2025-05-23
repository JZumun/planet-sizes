<template>
  <div class="celestial-body">
    <div class="figure">
      <div class="body"></div>
      <div v-if="body.rings" class="rings"></div>
    </div>
    <div class="labels">
      <p v-if="showName" class="name">{{ body.name }}</p>
      <p v-if="showDiameter" class="size">{{ friendlyDiameter }}</p>
      <div class="details" :class="{ visible: showGroups }">
        <!-- <p v-if="body.description" class="description">{{ body.description }}</p> -->
        <p class="group-header">Links</p>
        <ul class="group-list">
          <li v-for="group in groups" :key="group.key">
            <router-link :to="`?g=${group.key}`" replace>{{ group.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Body, getGroupsOfBody } from "../../data/data";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    body: Body;
    scale: number;
    showName?: boolean;
    showDiameter?: boolean;
    showGroups?: boolean;
  }>(),
  {
    showName: true,
    showDiameter: true,
    showGroups: true,
  }
);

const width = computed(() => `${(props.body.radius[0] * 2) / props.scale}px`);
const height = computed(() => (props.body.radius[1] ? `${(props.body.radius[1] * 2) / props.scale}px` : width.value));

const tilt = computed(() => `${props.body.tilt ?? 0}deg`);
const color = computed(() => props.body.color);

const friendlyDiameter = computed(() => `${Intl.NumberFormat().format(Math.floor(props.body.radius[0] * 2))} km`);

const ringWidth = computed(() => `${((props.body.rings?.radius ?? 0) * 2) / props.scale}px`);
const ringColor = computed(() => props.body.rings?.color ?? "transparent");

const groups = computed(() => getGroupsOfBody(props.body.key));
</script>

<style scoped>
.celestial-body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.figure {
  display: grid;
  justify-content: center;
  align-items: center;
  justify-items: center;
  grid-template-areas: "figure";
  transform: rotate(v-bind(tilt));
  transition: transform 1s;
}
.body {
  grid-area: figure;
  background-color: v-bind(color);
  position: relative;
  height: v-bind(height);
  width: v-bind(width);
  border-radius: 100%;
  overflow: hidden;
  isolation: isolate;
}
.body::before {
  --equator-thickness: 1px;
  --equator-curvature: 0;
  content: "";
  display: block;
  position: absolute;
  border-bottom: var(--equator-thickness) dashed #111;
  /* border-radius: 100%; */
  width: v-bind(width);
  height: var(--equator-curvature);
  left: 0;
  top: calc(50% - var(--equator-thickness) / 2);
  opacity: 0.4;
}
.body::after {
  content: "";
  display: block;
  height: 100%;
  width: 100%;
  background: #ffffff21;
  position: absolute;
  top: 0;
  right: 0;
  mix-blend-mode: soft-light;
  border-radius: 100%;
  background: radial-gradient(circle at 25% 50%, #0000, #000 150%), url(/noise.svg);
  background-size: auto, 150px;
  filter: contrast(220%) brightness(500%);
}
.rings {
  grid-area: figure;
  height: 5%;
  border-radius: 50%;
  width: v-bind(ringWidth);
  background: v-bind(ringColor);
  opacity: 0.5;
  z-index: -1;
}

.body,
.body::before,
.rings {
  transition: height 1s, width 1s;
}

p {
  margin: 0;
  white-space: nowrap;
}

.labels {
  margin-top: 1em;
  text-align: center;
}
.size {
  font-size: 0.8em;
  opacity: 0.5;
}

.details {
  /* position: absolute;
  left: 0;
  right: 0; */
  height: 10em;
  opacity: 0;
  margin-left: -1em;
  margin-right: -1em;
  transition: opacity 0.5s;
}

.details.visible,
.celestial-body:hover .details {
  opacity: 1;
}

.description {
  margin-top: 2em;
  font-size: 0.8em;
  font-style: italic;
  color: #444;
  white-space: break-spaces;
}

.group-header {
  display: block;
  color: #222;
  padding: 0.5em;
  padding-top: 2em;
  font-size: 0.75em;
  border-bottom: 1px solid #222;
}
.group-list {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  margin: 0;
  font-size: 0.75em;
}
.group-list li {
  display: inline-block;
  white-space: nowrap;
}

.group-list a {
  display: block;
  color: #444;
  text-decoration: none;
  transition: transform 0.25s;
}
.group-list a:hover {
  color: #ddd;
  transform: scale(1.1);
}
</style>
