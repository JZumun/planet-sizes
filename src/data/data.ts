import data from "./data.yaml";
import { generateRandomGray } from "../utilities/color";

export interface Body {
  key: string;
  name: string;
  description?: string;
  radius: [number] | [number, number];
  tilt?: number;
  color: string;
  rings?: {
    radius: number;
    color: string;
  };
}

export interface Scene {
  key: string;
  name: string;
  includes: string[];
  system?: {
    main: string;
    suggested_scale: number;
    satellites: Record<string, {
      inclination: number;
      distance: number;
    }>;
  };
}

export interface Group {
  name: string;
  includes: Scene[];
}

export const scenes: Record<string, Scene> = fillKeys(data.scenes);

export const bodies: Record<string, Body> = fillKeys<Body>(data.bodies, (k, b) => ({
  ...b,
  color: b.color ?? generateRandomGray(k),
}));

export const presets: Group[] = Object.values(data.groups).map((x: any) => {
  return {
    name: x.name,
    includes: x.includes.map((k: string) => scenes[k]),
  };
});

export const getBodiesOfGroup = (group: string): Body[] =>
  scenes[group].includes.map((k) => bodies[k]);

export const getGroupsOfBody = (body: string): Scene[] =>
  Object.values(scenes)
    .filter((g) => g.includes.includes(body))
    .reverse();

function fillKeys<T, K = T>(
  obj: Record<string, T>,
  mapper: (k: string, o: T) => K = (k, o) => o as unknown as K
): Record<string, K & { key: string }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [key, { key, ...mapper(key, item) }]),
  );
}

export const getRandomBody = function randomBody(excludes: string[] = []) {
  const list = Object.values(bodies);
  const index = Math.floor(Math.random() * list.length);
  const body = list[index];

  if (!excludes.includes(body.key)) {
    return body;
  } else {
    return randomBody(excludes);
  }
}