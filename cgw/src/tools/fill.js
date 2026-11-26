import { Tool } from "./tool.js";

const toRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const toHex = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

// Заливка замкненої області кольором
export class FillTool extends Tool {
  name = "Заливка";
  icon = '<path d="M3 10l6-6 6 6-6 6zM3 10h12"/><path d="M17 12c0 2 1 3 1 4a1 1 0 0 1-2 0c0-1 1-2 1-4" fill="currentColor"/>';
  tolerance = 32; // допустима різниця каналів (для згладжених країв)

  onDown(p, e) {
    this.pickColors(e);
    const img = this.ctx.getImageData(0, 0, this.editor.width, this.editor.height);
    if (!this.flood(img, p, toRgb(this.fg))) return;
    this.editor.saveState();
    this.ctx.putImageData(img, 0, 0);
  }

  // Заливка рядками: з точки стеку фарбується весь горизонтальний відрізок,
  // у стек додаються перші пікселі відрізків у рядках вище та нижче
  flood({ width: w, height: h, data }, p, [r, g, b]) {
    const s = (p.y * w + p.x) * 4;
    const [tr, tg, tb] = [data[s], data[s + 1], data[s + 2]];
    if (tr === r && tg === g && tb === b) return false;
    const tol = this.tolerance, seen = new Uint8Array(w * h);
    const match = (i) => !seen[i] && Math.abs(data[i * 4] - tr) <= tol &&
      Math.abs(data[i * 4 + 1] - tg) <= tol && Math.abs(data[i * 4 + 2] - tb) <= tol;
    const stack = [p.y * w + p.x];
    while (stack.length) {
      let i = stack.pop();
      if (!match(i)) continue;
      const y = Math.floor(i / w), rowEnd = (y + 1) * w;
      while (i % w > 0 && match(i - 1)) i--; // до лівого краю відрізка
      let up = false, down = false;
      for (; i < rowEnd && match(i); i++) {
        seen[i] = 1;
        data[i * 4] = r;
        data[i * 4 + 1] = g;
        data[i * 4 + 2] = b;
        const m1 = y > 0 && match(i - w), m2 = y < h - 1 && match(i + w);
        if (m1 && !up) stack.push(i - w);
        if (m2 && !down) stack.push(i + w);
        up = m1;
        down = m2;
      }
    }
    return true;
  }
}

// Піпетка: колір пікселя -> колір 1 (ліва кнопка) або колір 2 (права)
export class PickerTool extends Tool {
  name = "Піпетка";
  icon = '<path d="M13 3l4 4-2 2-4-4zM11 7l-7 7v2h2l7-7"/>';

  onDown(p, e) {
    const color = toHex([...this.ctx.getImageData(p.x, p.y, 1, 1).data.slice(0, 3)]);
    if (e.button === 2) this.editor.palette.secondary = color;
    else this.editor.palette.primary = color;
  }
}
