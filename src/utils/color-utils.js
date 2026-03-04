export function gradientColor(value, min = -1, max = 1) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(t < 0.5 ? 0 : (t - 0.5) * 2 * 255);
  const b = Math.round(t > 0.5 ? 0 : (0.5 - t) * 2 * 255);
  const g = Math.round(t < 0.5 ? t * 2 * 180 : (1 - t) * 2 * 180);
  return `rgb(${r},${g},${b})`;
}

export function activationColor(value) {
  const t = Math.max(0, Math.min(1, value));
  const r = Math.round(64 + t * 140);
  const g = Math.round(120 + t * 100);
  const b = Math.round(220 - t * 80);
  return `rgb(${r},${g},${b})`;
}

export function weightColor(value) {
  const absVal = Math.abs(value);
  const t = Math.min(1, absVal / 2);
  if (value >= 0) {
    return `rgba(59, 130, 246, ${0.3 + t * 0.7})`;
  }
  return `rgba(239, 68, 68, ${0.3 + t * 0.7})`;
}

export function gradientHeatColor(value) {
  const absVal = Math.abs(value);
  const t = Math.min(1, absVal * 5);
  const r = Math.round(255 * t);
  const g = Math.round(140 * (1 - t));
  const b = Math.round(50);
  return `rgba(${r},${g},${b},${0.4 + t * 0.6})`;
}

export function lerpColor(color1, color2, t) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 0, g: 0, b: 0 };
}
