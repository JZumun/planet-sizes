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
  groups: CelestialBodyGroup[];
}

export interface CelestialBodyGroup {
  key: string;
  name: string;
  includes: string[];
}

export const groups: Record<string, CelestialBodyGroup> = fillKeys(data.groups);

export const bodies: Record<string, CelestialBodyData> = fillGroups(
  fillKeys(data.bodies)
);

function fillKeys<T>(obj: Record<string, T>): Record<string, T & { key: string }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [key, { key, ...item }])
  );
}

function fillGroups<T>(
  obj: Record<string, T>
): Record<string, T & { groups: CelestialBodyGroup[] }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [
      key,
      {
        groups: Object.values(groups)
          .filter((g) => g.includes.includes(key))
          .reverse(),
        ...item,
      },
    ])
  );
}
