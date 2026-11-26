import { Tool } from "./tool.js";

// Олівець: малювання квадратним пензлем без згладжування
export class PencilTool extends Tool {
  name = "Олівець";
  icon = '<path d="M4 16l1-4 8-8 3 3-8 8zM12 5l3 3"/>';

  get size() { return this.editor.options.size; }
  color() { return this.fg; }

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

  // Алгоритм Брезенхема: всі пікселі відрізка, без розривів при швидкому русі миші
  line(a, b) {
    let { x, y } = a;
    const dx = Math.abs(b.x - x), dy = -Math.abs(b.y - y);
    const sx = Math.sign(b.x - x), sy = Math.sign(b.y - y);
    let err = dx + dy;
    for (;;) {
      this.plot({ x, y });
      if (x === b.x && y === b.y) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x += sx; }
      if (e2 <= dx) { err += dx; y += sy; }
    }
  }

  plot(p) {
    const s = this.size;
    this.ctx.fillStyle = this.color();
    this.ctx.fillRect(p.x - (s >> 1), p.y - (s >> 1), s, s);
  }
}

// Гумка: великий квадратний пензель кольору 2 (фону)
export class EraserTool extends PencilTool {
  name = "Гумка";
  icon = '<path d="M3 13l7-7 6 6-5 5H7zM8 17h9"/>';

  get size() { return this.editor.options.size * 4; }
  color() { return this.bg; }
}

// Пензель: згладжена лінія з круглими кінцями
export class BrushTool extends PencilTool {
  name = "Пензель";
  icon = '<path d="M16 3l-6 7"/><path d="M9 10c-2 0-3 1-3 3 0 1-1 2-2 3 3 0 6-1 6-4z" fill="currentColor"/>';

  line(a, b) {
    const ctx = this.ctx;
    ctx.strokeStyle = this.color();
    ctx.lineWidth = this.size;
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x + 0.5, a.y + 0.5);
    ctx.lineTo(b.x + 0.5, b.y + 0.5);
    ctx.stroke();
  }

  plot(p) {
    this.line(p, p);
  }
}

// Розпилювач: випадкові точки в колі, поки кнопка натиснута
export class SprayTool extends PencilTool {
  name = "Розпилювач";
  icon = '<rect x="4" y="9" width="7" height="8" rx="1"/><path d="M6 9V6h3v3M13 6h1M15 4h1M15 8h1M17 6h1"/>';

  onDown(p, e) {
    super.onDown(p, e);
    this.timer = setInterval(() => this.plot(this.last), 30);
  }

  onUp() {
    clearInterval(this.timer);
  }

  line(a, b) {
    this.plot(b);
  }

  plot(p) {
    const r = this.size * 4;
    this.ctx.fillStyle = this.color();
    for (let i = 0; i < r; i++) {
      const angle = Math.random() * 2 * Math.PI, d = Math.random() * r;
      this.ctx.fillRect(Math.round(p.x + d * Math.cos(angle)), Math.round(p.y + d * Math.sin(angle)), 1, 1);
    }
  }
}

// Точка: кожне клацання ставить точку діаметром у товщину лінії
export class PointTool extends Tool {
  name = "Точка";
  icon = '<circle cx="10" cy="10" r="3" fill="currentColor"/>';

  onDown(p, e) {
    this.pickColors(e);
    this.editor.saveState();
    const s = this.editor.options.size, ctx = this.ctx;
    ctx.fillStyle = this.fg;
    if (s < 3) return ctx.fillRect(p.x, p.y, s, s); // 1–2 px — без згладжування
    ctx.beginPath();
    ctx.arc(p.x + 0.5, p.y + 0.5, s / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}
