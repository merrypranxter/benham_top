// Shows how to define a new named regime alongside the built-ins from
// presets.js, and predict its color before wiring it into the app.
import { REGIMES } from '../src/js/presets.js';
import { predictColor } from '../src/js/color-predict.js';

const myRegime = {
  key: '6',
  name: 'Six-Spoke',
  arcCount: 6,
  arcWidthDeg: 20,
  rotationHz: 4,
  strobe: false,
};

const allRegimes = [...REGIMES, myRegime];

for (const regime of allRegimes) {
  const prediction = predictColor({ arcWidthDeg: regime.arcWidthDeg, rotationHz: regime.rotationHz });
  console.log(`${regime.name.padEnd(15)} -> ${prediction.label} (${prediction.confidence})`);
}
