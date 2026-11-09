import { Bus } from "../shared/bus.js";
import { encodeVector, writeClipboard } from "../shared/clipboard.js";
import { arrangeSelf } from "../shared/windowing.js";
import { makeVector, formatValue } from "./vector.js";

const bus = new Bus("object2");
const info = document.getElementById("info");
const status = document.getElementById("status");
const grid = document.getElementById("grid");

function render(values, min, max) {
  info.textContent =
    "Вектор із " +
    values.length +
    " дробових чисел у діапазоні [" +
    min +
    "; " +
    max +
    "]";
  grid.textContent = "";
  values.forEach((v, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    const idx = document.createElement("span");
    idx.className = "idx";
    idx.textContent = "[" + i + "]";
    const val = document.createElement("span");
    val.textContent = formatValue(v);
    cell.append(idx, val);
    grid.appendChild(cell);
  });
}

async function generate({ from, runId, n, min, max }) {
  const values = makeVector(n, min, max);
  render(values, min, max);
  const ok = await writeClipboard(encodeVector(runId, values));
  status.className = ok ? "" : "warn";
  status.textContent = ok
    ? "Дані записано в буфер обміну (текстовий формат)"
    : "Буфер обміну недоступний, дані буде передано повідомленням";
  bus.send(from, "generated", { runId, n: values.length, clipboard: ok, data: values });
}

bus.on(async (m) => {
  if (m.type === "ping") {
    bus.send(m.from, "pong");
  } else if (m.type === "arrange") {
    arrangeSelf(m);
  } else if (m.type === "generate") {
    await generate(m);
  } else if (m.type === "shutdown") {
    info.textContent = "Lab6 завершено, вікно закривається";
    window.close();
  }
});
