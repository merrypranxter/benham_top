# Math Reference: benham_top

## Why a black-and-white pattern produces color

The retina's L (long-wavelength) and M (medium-wavelength) cone pathways
have different temporal impulse responses — M-cone signals reach the
cortex slightly faster than L-cone signals for the same physical flicker.
Under steady, colorless flicker this phase difference is usually invisible.
But a *spinning sector pattern* presents each retinal location with a
specific, repeating temporal waveform (a fast on/off burst followed by a
longer gap, or vice versa), and at the right frequency this waveform drives
the L and M pathways into different phases of their response. The
color-opponent stage downstream (red-green, blue-yellow channels) reads
that phase difference as if it were a real chromatic signal. The hue is a
side effect of timing, not of wavelength — hence "Fechner colors" / the
Benham's top illusion.

## Sector geometry

For `arcCount` sectors and `arcWidthDeg` degrees of white per sector:

```
period_deg   = 360 / arcCount
gap_deg      = period_deg - arcWidthDeg
duty_cycle   = arcWidthDeg / period_deg
```

A point on the disk at radius `r` sees one on/off cycle of the pattern per
disk rotation, with `arcCount` repeats per revolution. The *temporal*
frequency that point experiences is:

```
flicker_hz = rotation_hz * arcCount
```

This is why `arcCount` and `rotation_hz` interact: 3 arcs at 5 Hz rotation
produce the same 15 Hz local flicker as 1 arc at 15 Hz rotation, but the
duty cycle (and therefore the reported color) differs because `arcWidthDeg`
sets how much of each cycle is "on" versus "off".

## Frequency bands (heuristic, from the literature + this repo's defaults)

| Range | Effect |
|---|---|
| < 2 Hz | Color, if it appears at all, is faint and has a multi-second onset delay ("Slow Burn") |
| 2–10 Hz | The classic Fechner color band — most reliable hue reports |
| 10–15 Hz | Color weakens, becomes less saturated |
| ≥ 15 Hz | Above flicker fusion for chromatic channels — reads as flat gray ("Hyperspin") |

## Arc width → reported hue (heuristic)

| Arc width | Typical reported hue |
|---|---|
| ~15° | blue / cyan |
| ~30° | green / yellow |
| ~45° | red / orange |

These bands are *not* a precise physical law — they summarize commonly
reported results (Benham 1894; Anstis, Corney & Lotto) and individual
variation is large. `src/js/color-predict.js` implements this table plus
the frequency-band cutoffs above as `predictColor()`.

## References

- Benham, C. E. (1894). "The artificial spectrum top." *Nature*.
- Fechner, G. T. (1838). Original report of subjective colors from a
  rotating black-and-white disk.
- Anstis, S., Corney, R., & Lotto, B. on temporal mechanisms of
  Fechner/Benham color.
