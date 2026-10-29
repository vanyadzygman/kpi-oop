import { Shape } from "./shape.js";
import { OUTLINE_COLOR } from "../config.js";

export class LineShape extends Shape {
  trace(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
  }

  show(ctx) {
    ctx.save();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = 1;
    this.trace(ctx);
    ctx.stroke();
    ctx.restore();
  }
}
