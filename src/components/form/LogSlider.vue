<template>
  <input type="range" v-model="internalValue" min="0" max="100" step="1" />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const internalValue = ref(50);
    watch(internalValue, () => {
      const min = Math.log(props.min);
      const max = Math.log(props.max);
      const scale = (max - min) / 100;
      const actualValue = Math.exp(min + scale * internalValue.value);
      const clampedValue = props.step
        ? Math.floor(actualValue / props.step) * props.step
        : actualValue;
      emit("update:modelValue", clampedValue);
    });

    return { internalValue };
  },
});
</script>
