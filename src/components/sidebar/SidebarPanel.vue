<template>
  <fieldset class="panel">
    <legend v-if="name">{{name}}</legend>
    <slot />
  </fieldset>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: String,
  },
});
</script>

<style scoped>
.panel {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5em;
  align-items: center;
  border: 1px solid #222;
  margin: 0;
  padding: 1em;
}

.panel :deep(label) {
  grid-column: 1;
}

.panel :deep(.field) {
  grid-column: 2;
}
</style>
