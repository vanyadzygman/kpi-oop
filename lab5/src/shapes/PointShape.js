import { Shape } from "./shape.js";

export class PointShape extends Shape {
  set(x1, y1, x2, y2) {
    super.set(x2, y2, x2, y2);
  }

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
