export class Tool {
  cursor = "crosshair";

  constructor(editor) {
    this.editor = editor;
  }

  get ctx() {
    return this.editor.ctx;
  }

  pickColors(e) {
    const { primary, secondary } = this.editor.palette;
    [this.fg, this.bg] = e.button === 2 ? [secondary, primary] : [primary, secondary];
  }

  onDown(p, e) {}
  onMove(p, e) {}
  onUp(p, e) {}

  commit() {}
  reset() {
    this.editor.clearOverlay();
  }
  finish() {
    this.commit();
    this.reset();
  }
}
