export class Editor {
  constructor({ canvas, overlay, sheet, viewport, options, palette, status }) {
    Object.assign(this, { canvas, overlay, sheet, viewport, options, palette, status });
    this.ctx = canvas.getContext("2d", { willReadFrequently: true });
    this.octx = overlay.getContext("2d");
    this.zoom = 1;
    this.tool = null;
    this.dragging = false;
    this.bindPointer();
  }

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }

  setTool(tool) {
    this.tool?.finish();
    this.tool = tool;
    this.overlay.style.cursor = tool.cursor;
  }

  create(width, height) {
    this.tool?.reset();
    this.setSize(width, height);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, width, height);
    this.setFile("Без назви.bmp", false);
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
    const style = {
      width: this.width * this.zoom + "px",
      height: this.height * this.zoom + "px",
    };
    for (const el of [this.sheet, this.canvas, this.overlay])
      Object.assign(el.style, style);
    this.status.set("size", `${this.width} × ${this.height} px`);
    this.status.set("zoom", Math.round(this.zoom * 100) + "%");
  }

  clearOverlay() {
    this.octx.clearRect(0, 0, this.width, this.height);
  }

  bindPointer() {
    const o = this.overlay;
    o.addEventListener("pointerdown", (e) => {
      if (this.dragging || (e.button !== 0 && e.button !== 2)) return;
      this.dragging = true;
      o.setPointerCapture(e.pointerId);
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

  toImage(e) {
    const r = this.overlay.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - r.left) / this.zoom),
      y: Math.floor((e.clientY - r.top) / this.zoom),
    };
  }
}
