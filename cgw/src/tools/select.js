import { Tool } from "./tool.js";

// Прямокутне виділення. Виділений фрагмент можна перетягнути: тоді він стає «плаваючим»
// (floating) — лежить на overlay, доки його не зафіксують у растрі (commit)
export class SelectTool extends Tool {
  name = "Виділення";
  icon = '<rect x="3" y="4" width="14" height="12" stroke-dasharray="2 2"/>';
  rect = null; // {x, y, w, h}
  floating = null; // ImageData переміщуваного фрагмента

  get selection() { return this.floating ? null : this.rect; }

  onDown(p) {
    if (this.rect && this.contains(p)) {
      if (!this.floating) this.lift();
      this.offset = { x: p.x - this.rect.x, y: p.y - this.rect.y };
      this.moving = true;
    } else {
      this.commit();
      this.start = p;
      this.rect = null;
      this.moving = false;
    }
  }

  onMove(p) {
    if (this.moving) {
      this.rect.x = p.x - this.offset.x;
      this.rect.y = p.y - this.offset.y;
    } else {
      this.rect = this.area(this.start, p);
    }
    this.draw();
  }

  onUp() {
    if (this.rect && (!this.rect.w || !this.rect.h)) this.rect = null;
    this.draw();
  }

  // Прямокутник між двома точками, обрізаний межами растру
  area(a, b) {
    const { width, height } = this.editor;
    const cx = (v) => Math.min(width, Math.max(0, v)), cy = (v) => Math.min(height, Math.max(0, v));
    const x = cx(Math.min(a.x, b.x)), y = cy(Math.min(a.y, b.y));
    return { x, y, w: cx(Math.max(a.x, b.x)) - x, h: cy(Math.max(a.y, b.y)) - y };
  }

  contains(p) {
    const r = this.rect;
    return p.x >= r.x && p.y >= r.y && p.x < r.x + r.w && p.y < r.y + r.h;
  }

  // Вирізати фрагмент з растру: на його місці залишається колір 2
  lift() {
    const { x, y, w, h } = this.rect;
    this.editor.saveState();
    this.floating = this.ctx.getImageData(x, y, w, h);
    this.fillRect(this.rect);
  }

  commit() {
    if (!this.floating) return;
    const r = this.rect;
    this.ctx.putImageData(this.floating, r.x, r.y);
    this.floating = null;
    this.rect = this.area(r, { x: r.x + r.w, y: r.y + r.h });
    if (!this.rect.w || !this.rect.h) this.rect = null;
    this.draw();
  }

  reset() {
    this.rect = this.floating = null;
    this.draw();
  }

  fillRect({ x, y, w, h }) {
    this.ctx.fillStyle = this.editor.palette.secondary;
    this.ctx.fillRect(x, y, w, h);
  }

  // ---------- команди меню "Правка" ----------
  copy() {
    if (this.floating) return this.floating;
    const r = this.rect;
    return r && this.ctx.getImageData(r.x, r.y, r.w, r.h);
  }

  erase() {
    if (!this.floating && this.rect) {
      this.editor.saveState();
      this.fillRect(this.rect);
    }
    this.reset();
  }

  paste(img) {
    this.commit();
    this.editor.saveState();
    const o = this.editor.visibleOrigin();
    this.floating = img;
    this.rect = { x: o.x, y: o.y, w: img.width, h: img.height };
    this.draw();
  }

  selectAll() {
    this.commit();
    this.rect = { x: 0, y: 0, w: this.editor.width, h: this.editor.height };
    this.draw();
  }

  // Рамка виділення (біла суцільна + чорна пунктирна — видно на будь-якому фоні)
  draw() {
    const ctx = this.editor.octx, r = this.rect;
    this.editor.clearOverlay();
    this.editor.status.set("sel", r ? `${r.w} × ${r.h}` : "");
    if (!r) return;
    if (this.floating) ctx.putImageData(this.floating, r.x, r.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(r.x - 0.5, r.y - 0.5, r.w + 1, r.h + 1);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#000000";
    ctx.strokeRect(r.x - 0.5, r.y - 0.5, r.w + 1, r.h + 1);
    ctx.setLineDash([]);
  }
}
