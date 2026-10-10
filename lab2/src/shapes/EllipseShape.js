import { Shape } from "./shape.js";
import { OUTLINE_COLOR, ELLIPSE_FILL } from "../config.js";

export class EllipseShape extends Shape {
  trace(ctx) {
    const cx = (this.x1 + this.x2) / 2;
    const cy = (this.y1 + this.y2) / 2;
    const rx = Math.abs(this.x2 - this.x1) / 2;
    const ry = Math.abs(this.y2 - this.y1) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  }

  show(ctx) {
    ctx.save();
    this.trace(ctx);
    ctx.fillStyle = ELLIPSE_FILL;
    ctx.fill();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
}
