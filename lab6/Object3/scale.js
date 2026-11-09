export function niceStep(range, target) {
  const raw = range / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / pow;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nice * pow;
}

export function ticksFor(min, max, target) {
  const step = niceStep(max - min, target);
  const first = Math.ceil(min / step - 1e-9);
  const last = Math.floor(max / step + 1e-9);
  const values = [];
  for (let i = first; i <= last; i++) values.push(Number((i * step).toFixed(10)));
  const decimals = Math.max(0, Math.min(8, -Math.floor(Math.log10(step) + 1e-9)));
  return { values, decimals, step };
}

export function makeScale(values, width, height) {
  const margin = { left: 64, right: 28, top: 40, bottom: 44 };
  const w = Math.max(10, width - margin.left - margin.right);
  const h = Math.max(10, height - margin.top - margin.bottom);

  const xMin = 0;
  const xMax = Math.max(values.length - 1, 1);
  let yMin = Math.min(...values);
  let yMax = Math.max(...values);
  if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }
  const pad = (yMax - yMin) * 0.06;
  yMin -= pad;
  yMax += pad;

  return {
    margin,
    w,
    h,
    xMin,
    xMax,
    yMin,
    yMax,
    axisY: yMin <= 0 && yMax >= 0 ? 0 : yMin,
    px: (x) => margin.left + ((x - xMin) / (xMax - xMin)) * w,
    py: (y) => margin.top + (1 - (y - yMin) / (yMax - yMin)) * h,
    xTicks: ticksFor(xMin, xMax, Math.max(2, Math.floor(w / 80))),
    yTicks: ticksFor(yMin, yMax, Math.max(2, Math.floor(h / 50))),
  };
}
