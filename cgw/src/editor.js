import { History } from "./history.js";

// Редактор: растр (image-canvas), шар ескізів (overlay-canvas), масштаб, історія змін.
// Події миші передаються поточному інструменту (патерн «Стратегія»)
export class Editor {
  constructor({ canvas, overlay, sheet, viewport, options, palette, status }) {
    Object.assign(this, { canvas, overlay, sheet, viewport, options, palette, status });
    this.ctx = canvas.getContext("2d", { willReadFrequently: true });
    this.octx = overlay.getContext("2d");
    this.history = new History();
    this.handlers = {};
    this.zoom = 1;
    this.tool = null;
    this.dragging = false;
    this.bindPointer();
  }

  get width() { return this.canvas.width; }
  get height() { return this.canvas.height; }

  on(event, fn) { (this.handlers[event] ??= []).push(fn); }
  emit(event, arg) { (this.handlers[event] ?? []).forEach((fn) => fn(arg)); }

  setTool(tool) {
    this.tool?.finish();
    this.tool = tool;
    this.overlay.style.cursor = tool.cursor;
    this.emit("tool", tool);
  }

  // ---------- документ ----------
  create(width, height) {
    this.tool?.reset();
    this.setSize(width, height);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, width, height);
    this.history.clear();
    this.setFile("Без назви.bmp", false);
  }

  load(img, name) {
    this.tool?.reset();
    this.restore(img);
    this.history.clear();
    this.setFile(name, false);
  }

  setFile(name, modified) {
    this.fileName = name;
    this.modified = modified;
    const title = name + (modified ? " *" : "");
    this.status.set("file", title);
    document.title = title + " — Растровий редактор";
  }

  setSize(width, height) {
    this.canvas.width = this.overlay.width = width;
    this.canvas.height = this.overlay.height = height;
    this.setZoom(this.zoom);
  }

  setZoom(zoom) {
    this.tool?.commit();
    this.zoom = Math.min(16, Math.max(1 / 8, zoom));
    const style = { width: this.width * this.zoom + "px", height: this.height * this.zoom + "px" };
    for (const el of [this.sheet, this.canvas, this.overlay]) Object.assign(el.style, style);
    this.status.set("size", `${this.width} × ${this.height} px`);
    this.status.set("zoom", Math.round(this.zoom * 100) + "%");
  }

  // ---------- історія ----------
  snapshot() {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }

  restore(img) {
    if (img.width !== this.width || img.height !== this.height) this.setSize(img.width, img.height);
    this.ctx.putImageData(img, 0, 0);
  }

  // Викликається ПЕРЕД кожною зміною растру
  saveState() {
    this.history.push(this.snapshot());
    this.setFile(this.fileName, true);
  }

  undo() { this.step((current) => this.history.undo(current)); }
  redo() { this.step((current) => this.history.redo(current)); }

  step(take) {
    this.tool.reset();
    const img = take(this.snapshot());
    if (!img) return;
    this.restore(img);
    this.setFile(this.fileName, true);
  }

  // ---------- операції над растром ----------
  flush() {
    this.tool?.commit(); // зафіксувати незавершену дію (текст, переміщуваний фрагмент)
  }

  clearOverlay() {
    this.octx.clearRect(0, 0, this.width, this.height);
  }

  // ---------- миша ----------
  bindPointer() {
    const o = this.overlay;
    o.addEventListener("pointerdown", (e) => {
      if (this.dragging || (e.button !== 0 && e.button !== 2)) return;
      this.dragging = true;
      o.setPointerCapture(e.pointerId); // рух відстежується і за межами растру
      this.tool.onDown(this.toImage(e), e);
    });
    o.addEventListener("pointermove", (e) => {
      const p = this.toImage(e);
      this.status.set("pos", `${p.x}, ${p.y} px`);
      if (this.dragging) this.tool.onMove(p, e);
    });
    o.addEventListener("pointerup", (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      this.tool.onUp(this.toImage(e), e);
    });
    o.addEventListener("pointerleave", () => this.status.set("pos", ""));
    o.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // Екранні координати -> координати пікселя растру
  toImage(e) {
    const r = this.overlay.getBoundingClientRect();
    return { x: Math.floor((e.clientX - r.left) / this.zoom), y: Math.floor((e.clientY - r.top) / this.zoom) };
  }

  // Лівий верхній піксель видимої частини растру (сюди вставляється фрагмент)
  visibleOrigin() {
    const r = this.overlay.getBoundingClientRect(), v = this.viewport.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor((v.left - r.left) / this.zoom)),
      y: Math.max(0, Math.floor((v.top - r.top) / this.zoom)),
    };
  }
}
