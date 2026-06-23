import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sectorPeriodDeg,
  isWhiteAtAngle,
  clampArcCount,
  clampArcWidthDeg,
  MIN_ARC_COUNT,
  MAX_ARC_COUNT,
  MIN_ARC_WIDTH_DEG,
} from '../src/js/arc-pattern.js';

test('sectorPeriodDeg divides the circle evenly', () => {
  assert.equal(sectorPeriodDeg(3), 120);
  assert.equal(sectorPeriodDeg(4), 90);
  assert.equal(sectorPeriodDeg(1), 360);
});

test('isWhiteAtAngle: white from 0 up to arcWidthDeg, black after', () => {
  // 3 arcs, 45 degree width -> period 120
  assert.equal(isWhiteAtAngle(0, 3, 45), true);
  assert.equal(isWhiteAtAngle(44.9, 3, 45), true);
  assert.equal(isWhiteAtAngle(45, 3, 45), false);
  assert.equal(isWhiteAtAngle(119, 3, 45), false);
});

test('isWhiteAtAngle repeats every period and handles negative angles', () => {
  assert.equal(isWhiteAtAngle(120, 3, 45), isWhiteAtAngle(0, 3, 45));
  assert.equal(isWhiteAtAngle(-1, 3, 45), isWhiteAtAngle(119, 3, 45));
});

test('clampArcCount stays within bounds and rounds', () => {
  assert.equal(clampArcCount(0), MIN_ARC_COUNT);
  assert.equal(clampArcCount(100), MAX_ARC_COUNT);
  assert.equal(clampArcCount(3.6), 4);
});

test('clampArcWidthDeg always leaves a gap', () => {
  const arcCount = 4; // period = 90
  assert.equal(clampArcWidthDeg(1, arcCount), MIN_ARC_WIDTH_DEG);
  assert.ok(clampArcWidthDeg(1000, arcCount) < sectorPeriodDeg(arcCount));
});
