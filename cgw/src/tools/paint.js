import { Tool } from "./tool.js";

export class PencilTool extends Tool {
  get size() {
    return this.editor.options.size;
  }
  color() {
    return this.fg;
  }

  onDown(p, e) {
    this.pickColors(e);
    this.editor.saveState();
    this.last = p;
    this.plot(p);
  }

  onMove(p) {
    this.line(this.last, p);
    this.last = p;
  }

  line(a, b) {
    let { x, y } = a;
    const dx = Math.abs(b.x - x),
      dy = -Math.abs(b.y - y);
    const sx = Math.sign(b.x - x),
      sy = Math.sign(b.y - y);
    let err = dx + dy;
    for (;;) {
      this.plot({ x, y });
      if (x === b.x && y === b.y) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
  }

  plot(p) {
    const s = this.size;
    this.ctx.fillStyle = this.color();
    this.ctx.fillRect(p.x - (s >> 1), p.y - (s >> 1), s, s);
  }
}
