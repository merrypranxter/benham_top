// Subjective color prediction by arc parameters.
//
// This is a heuristic model of Fechner-color reports from the Benham-top
// literature (Benham 1894; Anstis, Corney & Lotto on temporal color
// mechanisms), not a measured psychophysical lookup. Individual variation
// is large — treat the result as "likely region of color space", not fact.

const ARC_WIDTH_BANDS = [
  { maxDeg: 20, label: 'blue / cyan', hex: '#3aa0ff' },
  { maxDeg: 37, label: 'green / yellow', hex: '#8fd13a' },
  { maxDeg: Infinity, label: 'red / orange', hex: '#ff6a3a' },
];

/** Rotation speeds outside this band suppress color emergence entirely. */
const COLOR_BAND_HZ = { min: 2, max: 10 };
const HYPERSPIN_THRESHOLD_HZ = 15;

/**
 * @param {{arcWidthDeg: number, rotationHz: number}} params
 * @returns {{label: string, hex: string, note: string, confidence: 'low'|'medium'}}
 */
export function predictColor({ arcWidthDeg, rotationHz }) {
  if (rotationHz >= HYPERSPIN_THRESHOLD_HZ) {
    return {
      label: 'none (pure flicker)',
      hex: '#ffffff',
      note: `${rotationHz.toFixed(1)} Hz is above fusion frequency — the disk reads as flat gray, no hue.`,
      confidence: 'medium',
    };
  }

  if (rotationHz < COLOR_BAND_HZ.min) {
    return {
      label: 'faint, delayed onset',
      hex: '#cccccc',
      note: `${rotationHz.toFixed(1)} Hz is below the typical 2–10 Hz Fechner band — color may take several seconds to appear, if at all.`,
      confidence: 'low',
    };
  }

  const band = ARC_WIDTH_BANDS.find((b) => arcWidthDeg < b.maxDeg) ?? ARC_WIDTH_BANDS[ARC_WIDTH_BANDS.length - 1];
  const inSweetSpot = rotationHz <= COLOR_BAND_HZ.max;

  return {
    label: band.label,
    hex: band.hex,
    note: inSweetSpot
      ? `${arcWidthDeg.toFixed(0)}° arcs at ${rotationHz.toFixed(1)} Hz sit in the typical Fechner color band.`
      : `${rotationHz.toFixed(1)} Hz is above the 2–10 Hz sweet spot — color saturation likely weaker than predicted.`,
    confidence: inSweetSpot ? 'medium' : 'low',
  };
}
