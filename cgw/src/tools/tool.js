// Базовий клас інструменту. Editor викликає onDown / onMove / onUp з координатами пікселя
export class Tool {
  name = "Інструмент";
  icon = "";
  cursor = "crosshair";

  constructor(editor) {
    this.editor = editor;
  }

  get tip() { return this.name; } // текст підказки на Toolbar
  get ctx() { return this.editor.ctx; }

  // Ліва кнопка: колір 1 — контур, колір 2 — заливка; права кнопка — навпаки
  pickColors(e) {
    const { primary, secondary } = this.editor.palette;
    [this.fg, this.bg] = e.button === 2 ? [secondary, primary] : [primary, secondary];
  }

  onDown(p, e) {}
  onMove(p, e) {}
  onUp(p, e) {}

  commit() {} // зафіксувати незавершену дію у растрі
  reset() { this.editor.clearOverlay(); } // скинути стан без фіксації
  finish() {
    this.commit();
    this.reset();
  }
}
