<template>
    <section class="celestial-bodies">
        <div class="body" v-for="body in display" :key="body.body.key" :style="`--distance: ${body.distance}`">
            <celestial-body :key="body.body.key" :id="body.body.key" :body="body.body" :scale="scale"
                :show-groups="false" :show-name="showName" :show-diameter="showDiameter" />
        </div>
    </section>
</template>

<script setup lang=ts>
import { computed } from 'vue';
import { Scene, Body, bodies } from '../../data/data';
import CelestialBody from './CelestialBody.vue';

const props = defineProps<{
    scene: NonNullable<Scene["system"]>;
    scale: number;
    showName: boolean;
    showDiameter: boolean;
}>();

const main = computed(() => bodies[props.scene.main]);
const initialOffset = computed(() => main.value.radius[0]);

const display = computed(() => {
    let previousDistance = 0
    return [
        {
            body: { ...main.value, tilt: 0 },
            distance: initialOffset.value / props.scale
        },
        ...Object.entries(props.scene.satellites).map(([key, info]) => {
            const distance = info.distance - previousDistance;
            previousDistance = info.distance;
            return {
                body: bodies[key],
                distance: distance / props.scale
            }
        })
    ]
});
</script>

<style scoped>
.body {
    width: 0;
    margin-left: calc(var(--distance)*1px);
}
</style>