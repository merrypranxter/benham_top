import { test } from 'node:test';
import assert from 'node:assert/strict';
import { predictColor } from '../src/js/color-predict.js';

test('Hyperspin band (>=15Hz) predicts no color', () => {
  const result = predictColor({ arcWidthDeg: 45, rotationHz: 20 });
  assert.match(result.label, /none/);
});

test('Slow Burn band (<2Hz) predicts faint/delayed color', () => {
  const result = predictColor({ arcWidthDeg: 45, rotationHz: 1 });
  assert.match(result.label, /delayed/);
  assert.equal(result.confidence, 'low');
});

test('15 degree arcs in the sweet spot predict blue/cyan', () => {
  const result = predictColor({ arcWidthDeg: 15, rotationHz: 5 });
  assert.match(result.label, /blue/);
});

test('30 degree arcs in the sweet spot predict green/yellow', () => {
  const result = predictColor({ arcWidthDeg: 30, rotationHz: 5 });
  assert.match(result.label, /green/);
});

test('45 degree arcs in the sweet spot predict red/orange', () => {
  const result = predictColor({ arcWidthDeg: 45, rotationHz: 5 });
  assert.match(result.label, /red/);
});

test('above the 2-10Hz sweet spot lowers confidence', () => {
  const result = predictColor({ arcWidthDeg: 45, rotationHz: 12 });
  assert.equal(result.confidence, 'low');
});
