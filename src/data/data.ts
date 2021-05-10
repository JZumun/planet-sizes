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

export const bodies = fillKeys(data.bodies) as Record<string, CelestialBodyData>;
export const groups = fillKeys(data.groups) as Record<string, CelestialBodyGroup>;

function fillKeys<T>(obj: Record<string, T>): Record<string, T & { key: string }> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, item]) => [key, { key, ...item }])
  );
}
