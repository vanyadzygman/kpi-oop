import { Bus } from "../shared/bus.js";
import { Launcher } from "./launcher.js";
import { Log } from "./log.js";
import { askParams } from "./dialog.js";
import { runPipeline } from "./pipeline.js";

const bus = new Bus("lab6");
const log = new Log(document.getElementById("log"));
const launcher = new Launcher(
  bus,
  log,
  { object2: "../Object2/index.html", object3: "../Object3/index.html" },
  (app, alive) => document.getElementById("dot-" + app).classList.toggle("on", alive),
);

const menus = [...document.querySelectorAll(".menu")];
for (const menu of menus) {
  menu.querySelector(".title").addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = menu.classList.contains("open");
    menus.forEach((m) => m.classList.remove("open"));
    if (!wasOpen) menu.classList.add("open");
  });
}
document.addEventListener("click", () =>
  menus.forEach((m) => m.classList.remove("open")),
);

let busy = false;

async function onRun() {
  if (busy) return;
  const params = await askParams();
  if (!params) return;
  busy = true;
  try {
    await runPipeline({ bus, launcher, log }, params);
  } catch (e) {
    log.error(e.message);
  } finally {
    busy = false;
  }
}

document.getElementById("run-item").addEventListener("click", onRun);
document.getElementById("about-item").addEventListener("click", () => {
  alert("Лабораторна робота №6. Менеджер Lab6 керує програмами Object2 та Object3.");
});

launcher.monitor();

window.addEventListener("pagehide", () => {
  bus.send("*", "shutdown");
  launcher.closeAll();
});
