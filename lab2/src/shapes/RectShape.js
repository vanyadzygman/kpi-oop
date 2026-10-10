import { Shape } from "./shape.js";
import { OUTLINE_COLOR, RECT_FILL } from "../config.js";

export class RectShape extends Shape {
  bounds() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    return { x: this.x1 - dx, y: this.y1 - dy, w: dx * 2, h: dy * 2 };
  }

  trace(ctx) {
    const b = this.bounds();
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.w, b.h);
  }

  show(ctx) {
    ctx.save();
    this.trace(ctx);
    ctx.fillStyle = RECT_FILL;
    ctx.fill();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}
