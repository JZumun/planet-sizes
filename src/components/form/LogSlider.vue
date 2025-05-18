<template>
  <input type="range" v-model="internalValue" min="0" max="100" step="10" />
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";

const { log: ln, exp, floor } = Math;
const props = withDefaults(
  defineProps<{
    min?: number;
    max: number;
    step?: number;
  }>(),
  {
    min: 0,
  }
);

const model = defineModel<number>();

const logMin = computed(() => ln(props.min));
const logMax = computed(() => ln(props.max));
const scale = computed(() => (logMax.value - logMin.value) / 100);

const internalValue = ref(50);
watch(internalValue, () => {
  const actualValue = exp(logMin.value + scale.value * internalValue.value);
  const clampedValue = props.step ? floor(actualValue / props.step) * props.step : actualValue;
  model.value = clampedValue;
});

/**
 model = e^(ln(min) + scale*internal)
 ln(model) = ln(min) + scale*internal
 internal = (ln(model) - ln(min)) / scale
 */

watch(model, () => {
  if (!model.value) {
    internalValue.value = 50;
  } else {
    internalValue.value = (ln(model.value) - logMin.value) / scale.value;
  }
});

watch(internalValue, () => {
  const min = ln(props.min);
  const max = ln(props.max);
  const scale = (max - min) / 100;
  const actualValue = Math.exp(min + scale * internalValue.value);
  const clampedValue = props.step ? Math.floor(actualValue / props.step) * props.step : actualValue;
});
</script>
