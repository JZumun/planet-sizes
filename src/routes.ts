import { createRouter, createWebHistory, LocationQueryValue } from "vue-router";
import { getBodiesOfGroup, scenes, bodies, Body } from "./data/data";

export const queryValueOrFirst = (item: LocationQueryValue | LocationQueryValue[]) =>
  Array.isArray(item) ? item[0] : item;

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Main",
      component: () => import("./components/gallery/Gallery.vue"),
      props(route) {
        let displayedBodies: Body[] = [];
        const scene = queryValueOrFirst(route.query.g);
        if (scene && scene in scenes) {
          displayedBodies = getBodiesOfGroup(scene);
        }
        const bodyValues = queryValueOrFirst(route.query.i);
        if (bodyValues) {
          displayedBodies = displayedBodies.concat(
            bodyValues
              .split(" ")
              .map((k) => bodies[k])
              .filter((b) => b && !displayedBodies.some((d) => d.key == b.key))
          );
        } else if (!scene && bodyValues == null) {
          displayedBodies = [bodies.earth];
        }

        return {
          bodies: displayedBodies,
        };
      },
    },
  ],
});
