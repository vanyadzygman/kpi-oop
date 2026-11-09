import { Shape } from "./shape.js";

export class LineShape extends Shape {
  trace(ctx) {
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
  }

  show(ctx) {
    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.trace(ctx);
    ctx.stroke();
    ctx.restore();
  }
}
