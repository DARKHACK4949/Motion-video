/** A pose is the ONLY thing that animates on an asset: position, rotation, scale, opacity. */
export type Pose = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
};

/** A track maps a (possibly fractional) frame to a pose delta. Tracks are pure → deterministic & sub-frame sampleable. */
export type Track = (frame: number) => Pose;

export const IDENTITY: Pose = { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };

export const pose = (p: Partial<Pose>): Pose => ({ ...IDENTITY, ...p });

/** Offsets add, scale and opacity multiply. */
export const combine = (...poses: Pose[]): Pose =>
  poses.reduce(
    (acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y,
      rotate: acc.rotate + p.rotate,
      scale: acc.scale * p.scale,
      opacity: acc.opacity * p.opacity,
    }),
    IDENTITY,
  );

export const stack =
  (...tracks: Track[]): Track =>
  (f) =>
    combine(...tracks.map((t) => t(f)));

export const still =
  (p: Partial<Pose>): Track =>
  () =>
    pose(p);
