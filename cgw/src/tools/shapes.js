import { Tool } from "./tool.js";

// Фігура вводиться протягуванням миші: поки кнопка натиснута — ескіз на overlay,
// після відпускання — фігура малюється у растрі
export class ShapeTool extends Tool {
  get tip() { return this.name + " (Shift — рівні сторони)"; }
  get fillMode() { return this.editor.options.fillMode; }

  onDown(p, e) {
    this.pickColors(e);
    this.start = p;
  }

  onMove(p, e) {
    this.editor.clearOverlay();
    this.draw(this.editor.octx, this.start, this.end(p, e));
  }

  onUp(p, e) {
    this.editor.clearOverlay();
    const end = this.end(p, e);
    if (end.x === this.start.x && end.y === this.start.y) return;
    this.editor.saveState();
    this.draw(this.ctx, this.start, end);
  }

  end(p, e) {
    if (!e.shiftKey) return p;
    const s = this.start, d = Math.max(Math.abs(p.x - s.x), Math.abs(p.y - s.y));
    return { x: s.x + d * Math.sign(p.x - s.x), y: s.y + d * Math.sign(p.y - s.y) };
  }

  draw(ctx, a, b) {
    const { size } = this.editor.options, fillMode = this.fillMode;
    const o = size % 2 ? 0.5 : 0; // зсув на пів пікселя — чіткі лінії непарної товщини
    ctx.save();
    ctx.lineWidth = size;
    ctx.strokeStyle = this.fg;
    ctx.fillStyle = fillMode === "fill" ? this.fg : this.bg;
    ctx.beginPath();
    const rect = { x: Math.min(a.x, b.x) + o, y: Math.min(a.y, b.y) + o, w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
    this.path(ctx, rect, { x: a.x + o, y: a.y + o }, { x: b.x + o, y: b.y + o });
    if (fillMode !== "stroke") ctx.fill();
    if (fillMode !== "fill") ctx.stroke();
    ctx.restore();
  }

  path(ctx, rect, a, b) {}
}

export class LineTool extends ShapeTool {
  name = "Лінія";
  icon = '<path d="M3 17L17 3"/>';

  get tip() { return "Лінія (Shift — під кутом 0°, 45°, 90°)"; }

  end(p, e) {
    if (!e.shiftKey) return p;
    const dx = Math.abs(p.x - this.start.x), dy = Math.abs(p.y - this.start.y);
    if (dx > 2 * dy) return { x: p.x, y: this.start.y };
    if (dy > 2 * dx) return { x: this.start.x, y: p.y };
    return super.end(p, e);
  }

  get fillMode() { return "stroke"; } // лінію не можна залити

  path(ctx, rect, a, b) {
    ctx.lineCap = "round";
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
}

export class RectTool extends ShapeTool {
  name = "Прямокутник";
  icon = '<rect x="3" y="5" width="14" height="10"/>';

  path(ctx, r) {
    ctx.rect(r.x, r.y, r.w, r.h);
  }
}

export class RoundRectTool extends ShapeTool {
  name = "Округлений прямокутник";
  icon = '<rect x="3" y="5" width="14" height="10" rx="3"/>';

  path(ctx, r) {
    ctx.roundRect(r.x, r.y, r.w, r.h, Math.min(r.w, r.h) / 5);
  }
}

export class EllipseTool extends ShapeTool {
  name = "Еліпс";
  icon = '<ellipse cx="10" cy="10" rx="7" ry="5"/>';

  path(ctx, r) {
    ctx.ellipse(r.x + r.w / 2, r.y + r.h / 2, r.w / 2, r.h / 2, 0, 0, 2 * Math.PI);
  }
}

// Багатокутник, заданий вершинами у відносних координатах (0..1) описаного прямокутника
export class PolygonTool extends ShapeTool {
  constructor(editor, name, points) {
    super(editor);
    this.name = name;
    this.points = points;
    const svg = points.map(([x, y]) => `${(2 + x * 16).toFixed(1)},${(2 + y * 16).toFixed(1)}`);
    this.icon = `<polygon points="${svg.join(" ")}"/>`;
  }

  path(ctx, r) {
    for (const [x, y] of this.points) ctx.lineTo(r.x + x * r.w, r.y + y * r.h);
    ctx.closePath();
  }
}

export const TRIANGLE = [[0.5, 0], [1, 1], [0, 1]];
export const RHOMBUS = [[0.5, 0], [1, 0.5], [0.5, 1], [0, 0.5]];
export const HEXAGON = [[0.25, 0], [0.75, 0], [1, 0.5], [0.75, 1], [0.25, 1], [0, 0.5]];
export const ARROW = [[0, 0.3], [0.6, 0.3], [0.6, 0], [1, 0.5], [0.6, 1], [0.6, 0.7], [0, 0.7]];
export const STAR = Array.from({ length: 10 }, (_, i) => {
  const angle = Math.PI * (i / 5 - 0.5), r = i % 2 ? 0.2 : 0.5;
  return [0.5 + r * Math.cos(angle), 0.5 + r * Math.sin(angle)];
});
