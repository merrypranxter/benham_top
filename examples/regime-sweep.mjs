// Sanity-checks color-predict.js against the README's documented table by
// running every built-in regime through predictColor().
import { REGIMES } from '../src/js/presets.js';
import { predictColor } from '../src/js/color-predict.js';

console.log('regime          arcs  width  Hz    prediction');
console.log('-'.repeat(60));

for (const r of REGIMES) {
  const p = predictColor({ arcWidthDeg: r.arcWidthDeg, rotationHz: r.rotationHz });
  console.log(
    `${r.name.padEnd(15)} ${String(r.arcCount).padEnd(5)} ${String(r.arcWidthDeg).padEnd(6)} ${String(r.rotationHz).padEnd(5)} ${p.label}`,
  );
}
