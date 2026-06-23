# Examples

Standalone snippets that exercise the pure modules (`arc-pattern.js`,
`color-predict.js`, `presets.js`) outside the full WebGL app.

- **arc-pattern-canvas2d.html** — a single-file Canvas2D renderer of the
  same arc pattern, no WebGL/shaders involved. Good for understanding the
  geometry math in isolation, or as a fallback for environments without
  WebGL2.
- **color-predict-cli.mjs** — run from Node to print a color prediction
  for arbitrary parameters: `node examples/color-predict-cli.mjs 30 5`.
- **custom-regime.mjs** — shows how to define and register a new named
  regime alongside the built-in ones from `presets.js`.
- **regime-sweep.mjs** — prints a table of color predictions across the
  built-in regimes, useful for sanity-checking the heuristic in
  `color-predict.js` against the README's documented table.
