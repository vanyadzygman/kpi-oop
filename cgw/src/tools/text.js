import { Tool } from "./tool.js";

const LINE = 1.2; // міжрядковий інтервал

// Текст: клацання відкриває поле введення; клацання поза ним — текст малюється у растрі
export class TextTool extends Tool {
  name = "Текст";
  icon = '<path d="M4 6V3h12v3M10 3v14M7 17h6"/>';
  cursor = "text";
  input = null;

  onDown(p, e) {
    if (this.input) return this.commit();
    this.pickColors(e);
    const { zoom, options } = this.editor;
    this.pos = p;
    this.font = options.font();
    this.size = options.fontSize;
    const el = (this.input = document.createElement("textarea"));
    el.className = "text-prompt";
    Object.assign(el.style, {
      left: p.x * zoom - 1 + "px", // -1: рамка поля
      top: p.y * zoom - 1 + "px",
      font: options.font(zoom),
      lineHeight: LINE,
      color: this.fg,
    });
    el.addEventListener("input", () => this.fit());
    el.addEventListener("keydown", (ev) => ev.key === "Escape" && this.reset());
    this.editor.sheet.append(el);
    this.fit();
    el.focus();
  }

  fit() {
    const el = this.input;
    el.style.width = el.style.height = "0";
    el.style.width = el.scrollWidth + 4 + "px";
    el.style.height = el.scrollHeight + "px";
  }

  commit() {
    const text = this.input?.value;
    this.reset();
    if (!text?.trim()) return;
    const ctx = this.ctx, lh = this.size * LINE;
    this.editor.saveState();
    ctx.font = this.font;
    ctx.fillStyle = this.fg;
    ctx.textBaseline = "middle";
    text.split("\n").forEach((line, i) => ctx.fillText(line, this.pos.x, this.pos.y + i * lh + lh / 2));
  }

  reset() {
    this.input?.remove();
    this.input = null;
  }
}
