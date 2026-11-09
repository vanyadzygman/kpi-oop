import { Shape } from "./shape.js";
import { RECT_FILL } from "../config.js";

export class RectShape extends Shape {
  constructor() {
    super();
    this.fill = RECT_FILL;
  }

  trace(ctx) {
    ctx.rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }

  show(ctx) {
    ctx.save();
    ctx.beginPath();
    this.trace(ctx);
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}
