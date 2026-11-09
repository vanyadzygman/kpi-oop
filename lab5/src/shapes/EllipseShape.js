import { Shape } from "./shape.js";

export class EllipseShape extends Shape {
  constructor() {
    super();
    this.fill = null;
  }

  trace(ctx) {
    const rx = Math.abs(this.x2 - this.x1);
    const ry = Math.abs(this.y2 - this.y1);
    ctx.moveTo(this.x1 + rx, this.y1);
    ctx.ellipse(this.x1, this.y1, rx, ry, 0, 0, Math.PI * 2);
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
