<template>
  <sidebar-panel name="Explore">
    <label for="presets">Presets</label>
    <select name="presets" id="presets" v-model="preset" required>
      <option :value="''" selected disabled hidden>Choose a preset...</option>
      <optgroup v-for="collection in presets" :key="collection.name" :label="collection.name">
        <option
          v-for="scene in collection.includes"
          :key="scene.key"
          :value="scene.key"
        >{{scene.name}}</option>
      </optgroup>
    </select>

    <label for="bodies">Add:</label>
    <data-search
      id="bodies"
      class="field"
      placeholder="Look up..."
      v-model="searchInput"
      :data="bodyData"
    />

    <div class="field">
      <div class="body-tag" v-for="body in selected" :key="body.key">
        {{ body.name }}
        <button class="remove" @click.prevent="remove(body.key)">✕</button>
      </div>
    </div>
    <button class="field" @click.prevent="clear()">Clear</button>
  </sidebar-panel>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Body, bodies, presets } from "../../data/data";
import DataSearch from "../form/DataSearch.vue";
import SidebarPanel from "../sidebar/SidebarPanel.vue";

export default defineComponent({
  components: {
    DataSearch,
    SidebarPanel,
  },
  props: {
    scene: {
      type: String,
    },
    bodies: {
      type: Array as PropType<Body[]>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const preset = computed({
      get: () => props.scene ?? "",
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

    const searchInput: Ref<Body | null> = ref(null);
    const bodyData = Object.fromEntries(
      Object.values(bodies).map((b) => [b.name, b])
    );
    watch(searchInput, (val) => {
      if (val && add(val.key)) {
        searchInput.value = null;
      }
    });
    return {
      bodyData,
      presets,
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