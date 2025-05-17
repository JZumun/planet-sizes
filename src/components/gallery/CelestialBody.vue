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

<script lang="ts">
import { Body, getGroupsOfBody } from "../../data/data";
import { defineComponent, PropType, computed } from "vue";
import { create as rand } from "random-seed";

function generateRandomGray(seed: string) {
  const r = rand(seed);
  const bias = 100 + r.intBetween(-30, 30);
  function generateGrayComponent() {
    return (r.intBetween(-4, 4) + bias).toString(16);
  }

  const red = generateGrayComponent();
  const green = generateGrayComponent();
  const blue = generateGrayComponent();
  return `#${red}${green}${blue}`;
}

export default defineComponent({
  props: {
    body: {
      type: Object as PropType<Body>,
      required: true,
    },
    scale: {
      required: true,
      type: Number,
    },
    showName: {
      type: Boolean,
      default: true,
    },
    showDiameter: {
      type: Boolean,
      default: true,
    },
    showGroups: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const width = computed(() => `${(props.body.radius[0] * 2) / props.scale}px`);
    const height = computed(() =>
      props.body.radius[1] ? `${(props.body.radius[1] * 2) / props.scale}px` : width.value
    );

    const tilt = computed(() => `${props.body.tilt ?? 0}deg`);
    const color = computed(() => props.body.color ?? generateRandomGray(props.body.key));

    const friendlyDiameter = computed(() => `${Intl.NumberFormat().format(Math.floor(props.body.radius[0] * 2))} km`);

    const ringWidth = computed(() => `${((props.body.rings?.radius ?? 0) * 2) / props.scale}px`);
    const ringColor = computed(() => props.body.rings?.color ?? "transparent");

    const groups = computed(() => getGroupsOfBody(props.body.key));

    return {
      width,
      height,
      tilt,
      color,
      friendlyDiameter,
      ringWidth,
      ringColor,
      groups,
    };
  },
});
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
  width: 85%;
  background: #ffffff21;
  position: absolute;
  top: 0;
  right: 19%;
  mix-blend-mode: overlay;
  border-radius: 100%;
}
.rings {
  grid-area: figure;
  height: 1px;
  border-radius: 1px;
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
