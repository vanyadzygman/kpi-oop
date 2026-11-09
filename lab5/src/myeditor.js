import { SHAPES_COUNT, DEFAULT_TYPE } from "./config.js";
import { createShape, toolName } from "./tools.js";

const CREATE_KEY = Symbol("MyEditor");

export class MyEditor {
  static getInstance = (() => {
    let instance = null;
    return (canvas) => {
      if (!instance) {
        if (!canvas) throw new Error("Перший виклик getInstance потребує canvas");
        instance = new MyEditor(CREATE_KEY, canvas);
      }
      return instance;
    };
  })();

  constructor(key, canvas) {
    if (key !== CREATE_KEY) {
      throw new Error("MyEditor — Singleton, використовуйте MyEditor.getInstance()");
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.listeners = { type: [], shapes: [] };

    this.pcshape = new Array(SHAPES_COUNT).fill(null);
    this.count = 0;
    this.selected = -1;

    this.type = DEFAULT_TYPE;
    this.current = null;
    this.drawing = false;

    canvas.addEventListener("mousedown", (e) => this.onLButtonDown(e));
    canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", (e) => this.onLButtonUp(e));
    window.addEventListener("resize", () => this.resize());

    this.resize();
  }

  on(event, handler) {
    this.listeners[event].push(handler);
  }

  emit(event, ...args) {
    for (const handler of this.listeners[event]) handler(...args);
  }

  setType(type) {
    this.type = type;
    this.emit("type", type);
  }

  getShapes() {
    return this.pcshape.slice(0, this.count);
  }

  describeShapes() {
    return this.getShapes().map((s) => ({
      name: toolName(s.type),
      x1: Math.round(s.x1),
      y1: Math.round(s.y1),
      x2: Math.round(s.x2),
      y2: Math.round(s.y2),
    }));
  }

  afterShapesChanged() {
    this.selected = -1;
    this.repaint();
    this.emit("shapes");
  }

  clear() {
    this.pcshape.fill(null);
    this.count = 0;
    this.current = null;
    this.drawing = false;
    this.afterShapesChanged();
  }

  removeShape(index) {
    if (index < 0 || index >= this.count) return;
    this.pcshape.splice(index, 1);
    this.pcshape.push(null);
    this.count--;
    this.afterShapesChanged();
  }

  loadShapes(shapes) {
    const list = shapes.slice(0, SHAPES_COUNT);
    this.pcshape.fill(null);
    list.forEach((s, i) => {
      this.pcshape[i] = s;
    });
    this.count = list.length;
    this.current = null;
    this.drawing = false;
    this.afterShapesChanged();
    return shapes.length - list.length;
  }

  select(index) {
    this.selected = index;
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
    return { x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) };
  }

  onLButtonDown(e) {
    if (e.button !== 0 || this.count >= SHAPES_COUNT) return;
    const p = this.pos(e);
    this.current = createShape(this.type);
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
    this.afterShapesChanged();
  }

  repaint() {
    const r = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, r.width, r.height);
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(this.ctx);
    }
    if (this.selected >= 0 && this.selected < this.count) {
      this.pcshape[this.selected].showSelection(this.ctx);
    }
    if (this.drawing && this.current) {
      this.current.showRubber(this.ctx);
    }
  }
}
