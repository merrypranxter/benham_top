// Sector geometry and arc width calculation.
//
// Pure functions, no DOM/WebGL dependency, so they can be unit tested and
// reused outside the renderer (e.g. examples/arc-pattern-canvas2d.html).

export const MIN_ARC_COUNT = 1;
export const MAX_ARC_COUNT = 12;
export const MIN_ARC_WIDTH_DEG = 5;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Degrees in one sector's repeating period (white arc + gap). */
export function sectorPeriodDeg(arcCount) {
  return 360 / arcCount;
}

/** The largest arc width that still leaves a gap for a given arc count. */
export function maxArcWidthDeg(arcCount) {
  return sectorPeriodDeg(arcCount);
}

/**
 * Whether a given angle (degrees, any range) falls on the white part of
 * the disk for the given pattern. Mirrors the per-pixel logic in
 * disk.frag, used here for testing and non-WebGL renderers.
 */
export function isWhiteAtAngle(angleDeg, arcCount, arcWidthDeg) {
  const period = sectorPeriodDeg(arcCount);
  const normalized = ((angleDeg % period) + period) % period;
  return normalized < arcWidthDeg;
}

export function clampArcCount(arcCount) {
  return clamp(Math.round(arcCount), MIN_ARC_COUNT, MAX_ARC_COUNT);
}

/** Arc width is clamped to (MIN_ARC_WIDTH_DEG, period) so a gap always remains. */
export function clampArcWidthDeg(arcWidthDeg, arcCount) {
  const period = sectorPeriodDeg(arcCount);
  return clamp(arcWidthDeg, MIN_ARC_WIDTH_DEG, period - 1);
}
