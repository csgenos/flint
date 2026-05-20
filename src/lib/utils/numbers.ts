export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

export function percentChange(from: number, to: number): number {
  if (from === 0) return 0;
  return (to - from) / Math.abs(from);
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
