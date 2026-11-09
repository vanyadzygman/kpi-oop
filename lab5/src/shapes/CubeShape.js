import { CompositeShape } from "./CompositeShape.js";
import { RectShape } from "./RectShape.js";
import { LineShape } from "./LineShape.js";
import { CUBE_COLOR, CUBE_DEPTH } from "../config.js";

export class CubeShape extends CompositeShape {
  constructor() {
    super();
    this.back = new RectShape();
    this.front = new RectShape();
    this.edges = [new LineShape(), new LineShape(), new LineShape(), new LineShape()];
    this.parts = [this.back, ...this.edges, this.front];

    for (const p of this.parts) p.stroke = CUBE_COLOR;
    this.back.fill = null;
    this.front.fill = null;
  }

  layout() {
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const s = Math.max(Math.abs(dx), Math.abs(dy));
    const fx1 = this.x1;
    const fy1 = this.y1;
    const fx2 = this.x1 + (dx < 0 ? -s : s);
    const fy2 = this.y1 + (dy < 0 ? -s : s);

    const o = s * CUBE_DEPTH;
    const bx1 = fx1 + o;
    const by1 = fy1 - o;
    const bx2 = fx2 + o;
    const by2 = fy2 - o;

    this.front.set(fx1, fy1, fx2, fy2);
    this.back.set(bx1, by1, bx2, by2);
    this.edges[0].set(fx1, fy1, bx1, by1);
    this.edges[1].set(fx2, fy1, bx2, by1);
    this.edges[2].set(fx2, fy2, bx2, by2);
    this.edges[3].set(fx1, fy2, bx1, by2);
  }
}
