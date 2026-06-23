// Named regimes from README.md's "Named Regimes" table, kept as data so
// main.js, tests, and examples/ all read from one source of truth.

export const REGIMES = [
  { key: '1', name: 'Benham Classic', arcCount: 3, arcWidthDeg: 45, rotationHz: 5, strobe: false },
  { key: '2', name: 'Maxwell', arcCount: 4, arcWidthDeg: 30, rotationHz: 5, strobe: false },
  { key: '3', name: 'Strobe', arcCount: 3, arcWidthDeg: 45, rotationHz: 5, strobe: true },
  { key: '4', name: 'Slow Burn', arcCount: 3, arcWidthDeg: 45, rotationHz: 1, strobe: false },
  { key: '5', name: 'Hyperspin', arcCount: 3, arcWidthDeg: 45, rotationHz: 20, strobe: false },
];

export function findRegimeByKey(key) {
  return REGIMES.find((r) => r.key === key);
}
