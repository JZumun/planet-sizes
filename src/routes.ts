import { createRouter, createWebHistory, LocationQueryValue } from "vue-router";
import { bodies, Body, getBodiesOfGroup, Scene, scenes } from "./data/data";

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
          displayedBodies = [bodies.earth, randomBody()]
        }

        return {
          scene: actualScene,
          bodies: displayedBodies,
        };
      },
    },
  ],
});

function randomBody() {
  const list = Object.values(bodies);
  const index = Math.floor(Math.random() * list.length);
  const body = list[index];

  if (body.key != "earth") {
    return body;
  } else {
    return randomBody();
  }
}