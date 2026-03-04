export function formatNum(n, decimals = 6) {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return Number(n).toFixed(decimals);
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
