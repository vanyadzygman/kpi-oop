import { Shape } from "./shape.js";
import { OUTLINE_COLOR } from "../config.js";

export class EllipseShape extends Shape {
  trace(ctx) {
    const rx = Math.abs(this.x2 - this.x1);
    const ry = Math.abs(this.y2 - this.y1);
    ctx.beginPath();
    ctx.ellipse(this.x1, this.y1, rx, ry, 0, 0, Math.PI * 2);
  }

  show(ctx) {
    ctx.save();
    this.trace(ctx);
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}
