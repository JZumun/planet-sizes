<template>
  <input type="search" v-model="value" :id="id" :list="`${id}-list`" v-bind="$attrs" />
  <datalist :id="`${id}-list`">
    <option v-for="item in searchList" :key="item" :value="item">{{item}}</option>
  </datalist>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<any>,
    },
    data: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = ref("");
    const searchList = computed(() => Object.keys(props.data));

    watch(value, (val) => {
      if (searchList.value.includes(val)) {
        emit("update:modelValue", props.data[val]);
        value.value = "";
      }
    });
    return {
      value,
      searchList,
    };
  },
});
</script>
