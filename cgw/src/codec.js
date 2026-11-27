const WRITABLE = ["bmp", "png", "jpg", "jpeg", "webp"];

export function createCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

const extension = (name) => name.split(".").pop().toLowerCase();

// Кодування / декодування файлів зображень
export class ImageCodec {
  static canWrite(name) {
    return WRITABLE.includes(extension(name));
  }

  // Будь-який формат, який знає браузер (BMP 1/4/8/16/24/32 біт, PNG, JPEG, GIF, WebP)
  // -> растр 24 біт: прозорі пікселі накладаються на білий фон
  static async decode(blob) {
    const bitmap = await createImageBitmap(blob);
    const ctx = createCanvas(bitmap.width, bitmap.height).getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, bitmap.width, bitmap.height);
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }

  static encode(canvas, name) {
    const ext = extension(name);
    if (ext === "png") return ImageCodec.toBlob(canvas, "image/png");
    if (ext === "webp") return ImageCodec.toBlob(canvas, "image/webp", 0.92);
    if (ext === "jpg" || ext === "jpeg") return ImageCodec.toBlob(canvas, "image/jpeg", 0.92);
    const img = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    return Promise.resolve(ImageCodec.encodeBmp(img));
  }

  static toBlob(canvas, type, quality) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  }

  // BMP 24 біт: заголовок файлу (14 байт) + BITMAPINFOHEADER (40 байт) + пікселі
  static encodeBmp({ width, height, data }) {
    const rowSize = Math.ceil((width * 3) / 4) * 4; // рядок вирівнюється до 4 байт
    const size = 54 + rowSize * height;
    const view = new DataView(new ArrayBuffer(size));
    view.setUint16(0, 0x4d42, true); // сигнатура "BM"
    view.setUint32(2, size, true); // розмір файлу
    view.setUint32(10, 54, true); // зсув до піксельних даних
    view.setUint32(14, 40, true); // розмір BITMAPINFOHEADER
    view.setInt32(18, width, true);
    view.setInt32(22, height, true);
    view.setUint16(26, 1, true); // кількість площин
    view.setUint16(28, 24, true); // біт на піксел
    view.setUint32(34, rowSize * height, true); // розмір растру
    view.setInt32(38, 2835, true); // 72 dpi по горизонталі
    view.setInt32(42, 2835, true); // 72 dpi по вертикалі
    const bytes = new Uint8Array(view.buffer);
    for (let y = 0; y < height; y++) {
      let p = 54 + (height - 1 - y) * rowSize; // рядки зберігаються знизу вгору
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        bytes[p++] = data[i + 2]; // B
        bytes[p++] = data[i + 1]; // G
        bytes[p++] = data[i]; // R
      }
    }
    return new Blob([bytes], { type: "image/bmp" });
  }
}
