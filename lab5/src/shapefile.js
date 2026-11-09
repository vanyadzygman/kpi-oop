import { createShape, hasType } from "./tools.js";

const HEADER = "type,x1,y1,x2,y2";

export function shapesToCsv(shapes) {
  const lines = [HEADER];
  for (const s of shapes) {
    lines.push([s.type, s.x1, s.y1, s.x2, s.y2].map((v) => (typeof v === "number" ? Math.round(v) : v)).join(","));
  }
  return lines.join("\n") + "\n";
}

export function csvToShapes(text) {
  const shapes = [];
  let bad = 0;
  for (const raw of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line === HEADER) continue;
    const f = line.split(",").map((x) => x.trim());
    const nums = f.slice(1).map(Number);
    if (f.length !== 5 || !hasType(f[0]) || f.slice(1).includes("") || nums.some((n) => !Number.isFinite(n))) {
      bad++;
      continue;
    }
    const shape = createShape(f[0]);
    shape.set(...nums);
    shapes.push(shape);
  }
  return { shapes, bad };
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function readTextFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.txt,text/csv,text/plain";
    input.addEventListener("change", async () => {
      const file = input.files[0];
      resolve(file ? await file.text() : null);
    });
    input.addEventListener("cancel", () => resolve(null));
    input.click();
  });
}
