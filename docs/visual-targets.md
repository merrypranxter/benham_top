# Visual Targets: benham_top

## Baseline appearance

- Pure black background, pure white arcs — no anti-aliased color, no
  gradient. The disk's edge should be a hard circle; sector edges hard
  steps (`step()`, not `smoothstep()`), since soft edges measurably reduce
  the illusion's strength.
- Disk fills roughly the central 90% of the shorter viewport dimension
  (`u_diskRadius = 0.48` against a unit-circle UV space), leaving a visible
  black margin so the circular boundary is unambiguous.

## Per-regime expected look

- **Benham Classic** (3 arcs, 45°, 5 Hz) — the canonical illusion. Most
  viewers report a faint reddish-orange band trailing the white arcs and a
  bluish band trailing the black gaps, within a few seconds of rotation
  starting.
- **Maxwell** (4 arcs, 30°) — narrower, more numerous sectors. Color
  segments appear smaller and more numerous around the ring, often
  greenish-yellow rather than red.
- **Strobe** — same disk, plus the full-viewport flicker overlay
  (`strobe.frag`) enabled. Expect the disk's pattern to be partially
  masked by the overlay's on/off flash; useful for isolating how much of
  the color effect depends on local sector flicker vs. global flicker.
- **Slow Burn** (1 Hz) — color should be weak or absent for the first few
  rotations, then build gradually. This is the regime to use when
  demonstrating that the effect is temporal-adaptation-driven, not
  instantaneous.
- **Hyperspin** (20 Hz) — the disk should look like a uniform gray ring
  with no hue at all; this is the negative control that shows the effect
  is frequency-dependent and not just "any spinning B&W disk produces
  color."

## Color prediction overlay (`C` key)

A small fixed panel, top-right, with:
- A solid circular swatch in the predicted hex color.
- The predicted label (e.g. "green / yellow").
- A one-line note explaining the frequency/width reasoning.
- The current arc count / width / rotation speed and a confidence tag.

The overlay is a prediction aid for calibrating parameters, not a claim
about what any individual viewer will actually perceive.

## Out of scope for this repo

- Photographic/video capture of the illusion (the effect is purely
  perceptual — a screenshot of the disk shows only black and white).
- Per-user calibration or eye-tracking based tuning.
