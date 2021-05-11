<template>
  <section class="options">
    <label for="presets">Presets</label>
    <select name="presets" id="presets" v-model="preset" required>
      <option :value="undefined" selected disabled hidden>Choose a preset...</option>
      <option v-for="group in groups" :key="group.key" :value="group.key">{{group.name}}</option>
    </select>

    <label for="bodies">Add:</label>
    <input
      type="search"
      id="bodies"
      class="field"
      placeholder="Look up..."
      list="body-list"
      @input="onInput($event.target)"
      @blur="onBlur($event.target)"
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
    <button class="field" @click.prevent="set()">Clear</button>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";
import { CelestialBodyData, bodies, groups } from "../data/data";

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<CelestialBodyData[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const preset = ref<string | undefined>(undefined);
    const selected = computed({
      get: () => props.modelValue,
      set(val) {
        emit("update:modelValue", val);
      },
    });

    const clearPreset = () => (preset.value = undefined);

    const remove = (key: string) => {
      clearPreset();
      return (selected.value = selected.value.filter((b) => b.key !== key));
    };
    const add = (key: string) => {
      if (key in bodies) {
        selected.value = [...remove(key), bodies[key]];
        clearPreset();
      }
    };
    const set = (...keys: string[]) => {
      if (keys.length == 0) {
        clearPreset();
      }
      selected.value = keys.map((k) => bodies[k]);
    };

    if (!selected.value || selected.value.length == 0) {
      set("earth");
    }

    watch(preset, () => {
      if (preset.value && preset.value in groups) {
        set(...groups[preset.value].includes);
      }
    });

    const onInput = (target: EventTarget | null) =>
      add((target as HTMLInputElement).value);
    const onBlur = (target: EventTarget | null) =>
      ((target as HTMLInputElement).value = "");
    return {
      selected,
      bodies,
      groups,
      remove,
      add,
      set,
      preset,
      onInput,
      onBlur,
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