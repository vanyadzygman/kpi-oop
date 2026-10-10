import { Shape } from "./shape.js";
import { OUTLINE_COLOR } from "../config.js";

export class PointShape extends Shape {
  trace(ctx) {
    ctx.beginPath();
    ctx.arc(this.x2, this.y2, 2, 0, Math.PI * 2);
  }

  show(ctx) {
    ctx.save();
    ctx.fillStyle = OUTLINE_COLOR;
    this.trace(ctx);
    ctx.fill();
    ctx.restore();
  }
}
