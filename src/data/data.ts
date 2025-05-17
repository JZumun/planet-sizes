import data from "./data.yaml";

export interface Body {
  key: string;
  name: string;
  radius: [number] | [number, number];
  tilt?: number;
  color?: string;
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

export const bodies: Record<string, Body> = fillKeys(data.bodies);

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

function fillKeys<T>(
  obj: Record<string, T>,
): Record<string, T & { key: string }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [key, { key, ...item }]),
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