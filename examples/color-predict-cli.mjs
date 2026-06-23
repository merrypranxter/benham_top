#!/usr/bin/env node
// Usage: node examples/color-predict-cli.mjs <arcWidthDeg> <rotationHz>
import { predictColor } from '../src/js/color-predict.js';

const [arcWidthDeg, rotationHz] = process.argv.slice(2).map(Number);

if (!Number.isFinite(arcWidthDeg) || !Number.isFinite(rotationHz)) {
  console.error('Usage: node examples/color-predict-cli.mjs <arcWidthDeg> <rotationHz>');
  process.exit(1);
}

const result = predictColor({ arcWidthDeg, rotationHz });
console.log(`${arcWidthDeg}° arcs @ ${rotationHz} Hz ->`, result);
