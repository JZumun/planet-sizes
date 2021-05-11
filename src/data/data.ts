import data from "./data.yaml";

export interface CelestialBodyData {
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

export interface CelestialBodyGroup {
  key: string;
  name: string;
  includes: string[];
}

export const groups: Record<string, CelestialBodyGroup> = fillKeys(data.groups);

export const bodies: Record<string, CelestialBodyData> = fillKeys(data.bodies);

export const getBodiesOfGroup = (group: string): CelestialBodyData[] =>
  groups[group].includes.map((k) => bodies[k]);

export const getGroupsOfBody = (body: string): CelestialBodyGroup[] =>
  Object.values(groups)
    .filter((g) => g.includes.includes(body))
    .reverse();

function fillKeys<T>(obj: Record<string, T>): Record<string, T & { key: string }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [key, { key, ...item }])
  );
}
