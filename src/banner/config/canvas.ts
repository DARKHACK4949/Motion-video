export const CANVAS = {
  width: 1280,
  height: 540,
  fps: 30,
  /** 6 s loop. Frame 180 (= frame 0 of the next loop) must equal frame 0. */
  durationInFrames: 180,
} as const;

/** Every ambient (always-visible) motion must complete an integer number of cycles over this period. */
export const LOOP = CANVAS.durationInFrames;

/** Seconds → frames. */
export const sec = (s: number) => Math.round(s * CANVAS.fps);
