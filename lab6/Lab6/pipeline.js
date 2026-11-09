export async function runPipeline({ bus, launcher, log }, { n, min, max }) {
  const runId = Date.now().toString(36);
  log.separator("Запуск " + runId + ": n = " + n + ", Min = " + min + ", Max = " + max);

  const alive = await launcher.ensureAll(["object2", "object3"]);
  if (!alive.object2 || !alive.object3) {
    throw new Error(
      "Не вдалося запустити: " +
        Object.keys(alive)
          .filter((a) => !alive[a])
          .join(", "),
    );
  }
  launcher.arrangeAll();
  log.info("Вікна Object2 і Object3 розташовано");

  const generated = bus.waitFor("generated", (m) => m.runId === runId, 15000);
  bus.send("object2", "generate", { runId, n, min, max });
  log.info("Lab6 → Object2: generate(n, Min, Max)");
  const g = await generated;
  log.ok(
    "Object2: вектор із " +
      g.n +
      " чисел створено, буфер обміну: " +
      (g.clipboard ? "дані записано" : "недоступний"),
  );

  const plotted = bus.waitFor("plotted", (m) => m.runId === runId, 20000);
  bus.send("object3", "plot", { runId, n: g.n, clipboard: g.clipboard, data: g.data });
  log.info("Lab6 → Object3: plot(runId, n)");
  const p = await plotted;
  if (!p.ok) throw new Error("Object3 не зміг отримати дані для графіка");
  log.ok(
    "Object3: графік побудовано, дані отримано " +
      (p.source === "clipboard"
        ? "з буфера обміну"
        : "з повідомлення (буфер обміну недоступний)"),
  );
}
