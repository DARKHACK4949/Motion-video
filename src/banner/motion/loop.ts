import { LOOP } from "../config/canvas";

const TAU = Math.PI * 2;

/**
 * Loop-safe oscillator: `cycles` must be an integer so value AND velocity at frame LOOP equal frame 0.
 */
export const loopSin = (frame: number, cycles: number, phase = 0) => {
  if (!Number.isInteger(cycles)) {
    throw new Error(`loopSin cycles must be an integer to stay seamless (got ${cycles})`);
  }
  return Math.sin((TAU * cycles * frame) / LOOP + phase);
};

export const loopCos = (frame: number, cycles: number, phase = 0) => loopSin(frame, cycles, phase + Math.PI / 2);
