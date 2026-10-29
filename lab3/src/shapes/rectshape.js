import { Shape } from "./shape.js";
import { OUTLINE_COLOR, RECT_FILL } from "../config.js";

export class RectShape extends Shape {
  trace(ctx) {
    ctx.beginPath();
    ctx.rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
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
