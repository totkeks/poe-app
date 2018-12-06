export enum Orbit {
  None = 0,
  Single = 1,
  Small = 2,
  Medium = 4,
  Large = 8,
  ExtraLarge = 16
}

export const OrbitRadii = new Map<Orbit, number>()
  .set(Orbit.Single, 0)
  .set(Orbit.Small, 82)
  .set(Orbit.Medium, 162)
  .set(Orbit.Large, 335)
  .set(Orbit.ExtraLarge, 493);

export const NodesPerOrbit = new Map<Orbit, number>()
  .set(Orbit.Single, 1)
  .set(Orbit.Small, 6)
  .set(Orbit.Medium, 12)
  .set(Orbit.Large, 12)
  .set(Orbit.ExtraLarge, 40);
