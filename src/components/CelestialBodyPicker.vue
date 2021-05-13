<template>
  <section class="options">
    <label for="presets">Presets</label>
    <select name="presets" id="presets" v-model="preset" required>
      <option :value="''" selected disabled hidden>Choose a preset...</option>
      <option v-for="group in groups" :key="group.key" :value="group.key">{{group.name}}</option>
    </select>

    <label for="bodies">Add:</label>
    <input
      type="search"
      id="bodies"
      class="field"
      placeholder="Look up..."
      list="body-list"
      v-model="searchInput"
      @blur="searchInput = ''"
    />
    <datalist id="body-list">
      <option v-for="body in bodies" :key="body.key" :value="body.key">{{ body.name }}</option>
    </datalist>

    <div class="field">
      <div class="body-tag" v-for="body in selected" :key="body.key">
        {{ body.name }}
        <button class="remove" @click.prevent="remove(body.key)">✕</button>
      </div>
    </div>
    <button class="field" @click.prevent="clear()">Clear</button>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CelestialBodyData, bodies, groups } from "../data/data";
import { queryValueOrFirst } from "../routes";

export default defineComponent({
  props: {
    bodies: {
      type: Array as PropType<CelestialBodyData[]>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const preset = computed({
      get: () => queryValueOrFirst(route.query.g) ?? "",
      set: (val) => router.replace(`/?g=${val}`),
    });

    const selected = computed({
      get: () => props.bodies,
      set: (val) => router.replace(`/?i=${val.map((b) => b.key).join(" ")}`),
    });

    const remove = (key: string) => {
      return (selected.value = selected.value.filter((b) => b.key !== key));
    };
    const add = (key: string) => {
      if (key in bodies) {
        selected.value = [bodies[key], ...remove(key)];
        return key;
      }
    };
    const clear = () => {
      selected.value = [];
    };

    const searchInput = ref("");
    watch(searchInput, (val) =>
      add(val) ? (searchInput.value = "") : undefined
    );
    return {
      bodies,
      groups,
      preset,
      selected,
      remove,
      add,
      clear,
      searchInput,
    };
  },
});
</script>

<style scoped>
.options {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1em;
  align-items: baseline;
}

.options > label {
  grid-column: 1;
}

.options > .field {
  grid-column: 2;
}

.body-tag {
  font-size: 0.85em;
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

.field.buttons {
  display: flex;
  gap: 0.25em;
  flex-wrap: wrap;
}
</style>