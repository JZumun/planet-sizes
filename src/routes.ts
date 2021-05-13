import { createRouter, createWebHistory, LocationQueryValue } from "vue-router";
import { getBodiesOfGroup, groups, bodies, CelestialBodyData } from "./data/data";

export const queryValueOrFirst = (item: LocationQueryValue | LocationQueryValue[]) =>
  Array.isArray(item) ? item[0] : item;

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Main",
      component: () => import("./components/CelestialGallery.vue"),
      props(route) {
        let displayedBodies: CelestialBodyData[] = [];
        const preset = queryValueOrFirst(route.query.g);
        if (preset && preset in groups) {
          displayedBodies = getBodiesOfGroup(preset);
        }
        const bodyValues = queryValueOrFirst(route.query.i);
        if (bodyValues) {
          displayedBodies = displayedBodies.concat(
            bodyValues
              .split(" ")
              .map((k) => bodies[k])
              .filter((b) => b && !displayedBodies.some((d) => d.key == b.key))
          );
        } else if (!preset && bodyValues == null) {
          displayedBodies = [bodies.earth];
        }

        return {
          bodies: displayedBodies,
        };
      },
    },
  ],
});
