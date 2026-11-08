import { Shape } from "./shape.js";

export class CompositeShape extends Shape {
  constructor() {
    if (new.target === CompositeShape) {
      throw new Error("CompositeShape is abstract");
    }
    super();
    this.parts = [];
  }

  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.layout();
  }

  layout() {
    throw new Error("layout() is not implemented");
  }

  trace(ctx) {
    for (const part of this.parts) part.trace(ctx);
  }

  show(ctx) {
    for (const part of this.parts) part.show(ctx);
  }
}
