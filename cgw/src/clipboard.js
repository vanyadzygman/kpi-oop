import { ImageCodec, createCanvas } from "./codec.js";

// Буфер обміну: системний (PNG) + внутрішня копія на випадок, якщо системний недоступний
export class Clipboard {
  constructor() {
    this.image = null;
  }

  async copy(img) {
    this.image = img;
    try {
      const canvas = createCanvas(img.width, img.height);
      canvas.getContext("2d").putImageData(img, 0, 0);
      const blob = await ImageCodec.toBlob(canvas, "image/png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch {
      // системний буфер недоступний — залишається внутрішня копія
    }
  }

  // Пункт меню "Вставити"
  async read() {
    try {
      for (const item of await navigator.clipboard.read()) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) return ImageCodec.decode(await item.getType(type));
      }
    } catch {
      // немає дозволу на читання — беремо внутрішню копію
    }
    return this.image;
  }

  // Ctrl+V: подія paste (дані доступні без запиту дозволу)
  fromEvent(e) {
    const file = [...e.clipboardData.files].find((f) => f.type.startsWith("image/"));
    return file ? ImageCodec.decode(file) : Promise.resolve(this.image);
  }
}
