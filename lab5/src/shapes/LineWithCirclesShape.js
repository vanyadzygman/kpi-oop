import { CompositeShape } from "./CompositeShape.js";
import { LineShape } from "./LineShape.js";
import { EllipseShape } from "./EllipseShape.js";
import { LINE_CIRCLES_COLOR, CIRCLE_FILL, CIRCLE_RADIUS } from "../config.js";

export class LineWithCirclesShape extends CompositeShape {
  constructor() {
    super();
    this.line = new LineShape();
    this.circle1 = new EllipseShape();
    this.circle2 = new EllipseShape();
    this.parts = [this.line, this.circle1, this.circle2];

    this.line.stroke = LINE_CIRCLES_COLOR;
    for (const c of [this.circle1, this.circle2]) {
      c.stroke = LINE_CIRCLES_COLOR;
      c.fill = CIRCLE_FILL;
    }
  }

  layout() {
    const r = CIRCLE_RADIUS;
    this.line.set(this.x1, this.y1, this.x2, this.y2);
    this.circle1.set(this.x1, this.y1, this.x1 + r, this.y1 + r);
    this.circle2.set(this.x2, this.y2, this.x2 + r, this.y2 + r);
  }
}
