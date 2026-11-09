import { makeScale } from "./scale.js";

export class Graph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.values = [];
    window.addEventListener("resize", () => this.draw());
  }

  setValues(values) {
    this.values = values;
    this.draw();
  }

  draw() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(r.width * dpr);
    this.canvas.height = Math.round(r.height * dpr);
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, r.width, r.height);
    if (this.values.length === 0) return;

    const s = makeScale(this.values, r.width, r.height);
    const left = s.margin.left;
    const right = left + s.w;
    const top = s.margin.top;
    const bottom = top + s.h;
    const axisPy = s.py(s.axisY);
    const axisPx = left;

    ctx.font = "12px Segoe UI, Tahoma, sans-serif";
    ctx.lineWidth = 1;

    ctx.strokeStyle = "#e6e6e6";
    ctx.beginPath();
    for (const v of s.xTicks.values) {
      const x = Math.round(s.px(v)) + 0.5;
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
    }
    for (const v of s.yTicks.values) {
      const y = Math.round(s.py(v)) + 0.5;
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(left, axisPy);
    ctx.lineTo(right + 14, axisPy);
    ctx.moveTo(axisPx, bottom);
    ctx.lineTo(axisPx, top - 14);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(right + 14, axisPy);
    ctx.lineTo(right + 6, axisPy - 4);
    ctx.lineTo(right + 6, axisPy + 4);
    ctx.closePath();
    ctx.moveTo(axisPx, top - 14);
    ctx.lineTo(axisPx - 4, top - 6);
    ctx.lineTo(axisPx + 4, top - 6);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (const v of s.xTicks.values) {
      const x = s.px(v);
      ctx.beginPath();
      ctx.moveTo(x, axisPy - 3);
      ctx.lineTo(x, axisPy + 3);
      ctx.stroke();
      ctx.fillText(v.toFixed(s.xTicks.decimals), x, axisPy + 6);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const v of s.yTicks.values) {
      const y = s.py(v);
      ctx.beginPath();
      ctx.moveTo(axisPx - 3, y);
      ctx.lineTo(axisPx + 3, y);
      ctx.stroke();
      ctx.fillText(v.toFixed(s.yTicks.decimals), axisPx - 8, y);
    }

    ctx.font = "italic 13px Segoe UI, Tahoma, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("x", right + 12, axisPy + 18);
    ctx.fillText("y", axisPx + 10, top - 12);

    ctx.strokeStyle = "#1565c0";
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.beginPath();
    this.values.forEach((v, i) => {
      const x = s.px(i);
      const y = s.py(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (this.values.length <= 100) {
      ctx.fillStyle = "#1565c0";
      this.values.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(s.px(i), s.py(v), 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
}
