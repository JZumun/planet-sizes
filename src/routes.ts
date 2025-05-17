import { createRouter, createWebHistory, LocationQueryValue } from "vue-router";
import { bodies, Body, getBodiesOfGroup, Scene, scenes, getRandomBody } from "./data/data";

export const queryValueOrFirst = (
  item: LocationQueryValue | LocationQueryValue[],
) => Array.isArray(item) ? item[0] : item;

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Main",
      component: () => import("./components/gallery/Gallery.vue"),
      props(route) {
        let displayedBodies: Body[] = [];
        let actualScene: Scene | undefined = undefined;
        const scene = queryValueOrFirst(route.query.g);
        if (scene && scene in scenes) {
          actualScene = scenes[scene];
          displayedBodies = getBodiesOfGroup(scene);
        }
        const bodyValues = queryValueOrFirst(route.query.i);
        if (bodyValues) {
          displayedBodies = displayedBodies.concat(
            bodyValues
              .split(" ")
              .map((k) => bodies[k])
              .filter((b) => b && !displayedBodies.some((d) => d.key == b.key)),
          );
        } else if (!scene && bodyValues == null) {
          displayedBodies = [bodies.earth, getRandomBody([bodies.earth.key])]
        }

        return {
          scene: actualScene,
          bodies: displayedBodies,
        };
      },
    },
  ],
});

router.beforeEach((to) => {
  if (to.path == "/") {
    if (!to.query.g && !to.query.i) {
      const random = getRandomBody([bodies.earth.key])
      return `/?i=earth ${random.key}`
    }
  } else {
    return true;
  }
});