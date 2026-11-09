export function makeVector(n, min, max) {
  return Array.from({ length: n }, () =>
    Number((min + Math.random() * (max - min)).toFixed(4)),
  );
}

export function formatValue(v) {
  return v.toFixed(4);
}
