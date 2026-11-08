import { Shape } from "./shape.js";

export class PointShape extends Shape {
  trace(ctx) {
    ctx.moveTo(this.x2 + 2, this.y2);
    ctx.arc(this.x2, this.y2, 2, 0, Math.PI * 2);
  }

  show(ctx) {
    ctx.save();
    ctx.fillStyle = this.stroke;
    ctx.beginPath();
    this.trace(ctx);
    ctx.fill();
    ctx.restore();
  }
}
