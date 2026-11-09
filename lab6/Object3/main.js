import { Bus } from "../shared/bus.js";
import { decodeVector, readClipboard } from "../shared/clipboard.js";
import { arrangeSelf } from "../shared/windowing.js";
import { Graph } from "./graph.js";

const bus = new Bus("object3");
const status = document.getElementById("status");
const graph = new Graph(document.getElementById("canvas"));

async function obtainData({ runId, n, clipboard, data }) {
  if (clipboard) {
    window.focus();
    const text = await readClipboard();
    if (text !== null) {
      const values = decodeVector(text, runId);
      if (values && values.length === n) return { values, source: "clipboard" };
    }
  }
  if (Array.isArray(data) && data.length === n)
    return { values: data, source: "message" };
  return null;
}

async function plot(msg) {
  const got = await obtainData(msg);
  if (!got) {
    status.className = "error";
    status.textContent = "Не вдалося отримати дані ні з буфера обміну, ні з повідомлення";
    bus.send(msg.from, "plotted", { runId: msg.runId, ok: false });
    return;
  }
  graph.setValues(got.values);
  status.className = got.source === "clipboard" ? "" : "warn";
  status.textContent =
    "Графік y = f(x) для " +
    got.values.length +
    " точок. Дані отримано " +
    (got.source === "clipboard"
      ? "з буфера обміну"
      : "з повідомлення (буфер обміну недоступний)");
  bus.send(msg.from, "plotted", { runId: msg.runId, ok: true, source: got.source });
}

bus.on(async (m) => {
  if (m.type === "ping") {
    bus.send(m.from, "pong");
  } else if (m.type === "arrange") {
    arrangeSelf(m);
  } else if (m.type === "plot") {
    await plot(m);
  } else if (m.type === "shutdown") {
    status.textContent = "Lab6 завершено, вікно закривається";
    window.close();
  }
});
