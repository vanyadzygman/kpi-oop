import { SHAPES_COUNT, DEFAULT_TYPE } from "./config.js";
import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectShape } from "./shapes/RectShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";

const FACTORIES = {
  point: () => new PointShape(),
  line: () => new LineShape(),
  rect: () => new RectShape(),
  ellipse: () => new EllipseShape(),
};

export class MyEditor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onTypeChange = () => {};

    this.pcshape = null;
    this.count = 0;
    this.allocShapes();

    this.type = DEFAULT_TYPE;
    this.current = null;
    this.drawing = false;

    canvas.addEventListener("mousedown", (e) => this.onLButtonDown(e));
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.onLButtonUp(e));
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("beforeunload", () => this.freeShapes());

    this.resize();
  }

  allocShapes() {
    this.pcshape = new Array(SHAPES_COUNT).fill(null);
    this.count = 0;
  }

  freeShapes() {
    this.pcshape = null;
    this.count = 0;
  }

  setType(type) {
    this.type = type;
    this.onTypeChange(type);
  }

  clear() {
    this.freeShapes();
    this.allocShapes();
    this.current = null;
    this.drawing = false;
    this.repaint();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.repaint();
  }

  pos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  onLButtonDown(e) {
    if (e.button !== 0 || this.count >= SHAPES_COUNT) return;
    const p = this.pos(e);
    this.current = FACTORIES[this.type]();
    this.current.set(p.x, p.y, p.x, p.y);
    this.drawing = true;
    this.repaint();
  }

  onMouseMove(e) {
    if (!this.drawing) return;
    const p = this.pos(e);
    this.current.set(this.current.x1, this.current.y1, p.x, p.y);
    this.repaint();
  }

  onLButtonUp(e) {
    if (!this.drawing || e.button !== 0) return;
    const p = this.pos(e);
    this.current.set(this.current.x1, this.current.y1, p.x, p.y);
    this.pcshape[this.count++] = this.current;
    this.current = null;
    this.drawing = false;
    this.repaint();
  }

  repaint() {
    const r = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, r.width, r.height);
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(this.ctx);
    }
    if (this.drawing && this.current) {
      this.current.showRubber(this.ctx);
    }
  }
}
