import { OUTLINE_COLOR, RUBBER_COLOR, RUBBER_DASH, SELECTION_COLOR } from "../config.js";

export class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("Shape is abstract");
    }
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.stroke = OUTLINE_COLOR;
  }

  set(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  show(ctx) {
    throw new Error("show() is not implemented");
  }

  trace(ctx) {
    throw new Error("trace() is not implemented");
  }

  showRubber(ctx) {
    ctx.save();
    ctx.strokeStyle = RUBBER_COLOR;
    ctx.lineWidth = 1;
    ctx.setLineDash(RUBBER_DASH);
    ctx.beginPath();
    this.trace(ctx);
    ctx.stroke();
    ctx.restore();
  }

  showSelection(ctx) {
    ctx.save();
    ctx.strokeStyle = SELECTION_COLOR;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    this.trace(ctx);
    ctx.stroke();
    ctx.restore();
  }
}
