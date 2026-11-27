import { ImageCodec } from "./codec.js";

const OPEN_TYPES = [
  { description: "Зображення", accept: { "image/*": [".bmp", ".png", ".jpg", ".jpeg", ".gif", ".webp"] } },
];
const SAVE_TYPES = [
  { description: "BMP, 24 біт", accept: { "image/bmp": [".bmp"] } },
  { description: "PNG", accept: { "image/png": [".png"] } },
  { description: "JPEG", accept: { "image/jpeg": [".jpg", ".jpeg"] } },
  { description: "WebP", accept: { "image/webp": [".webp"] } },
];

// Операції меню "Файл". Стандартні вікна вибору файлу — File System Access API
// (showOpenFilePicker / showSaveFilePicker), аналог GetOpenFileName / GetSaveFileName
export class FileManager {
  constructor(editor, sizeDialog) {
    this.editor = editor;
    this.sizeDialog = sizeDialog;
    this.handle = null; // поточний файл — для "Записати"
  }

  async create() {
    const size = await this.sizeDialog.ask("Новий растр", this.editor.width, this.editor.height);
    if (!size) return;
    this.handle = null;
    this.editor.create(size.width, size.height);
  }

  async open() {
    const [handle] = await window.showOpenFilePicker({ types: OPEN_TYPES });
    const file = await handle.getFile();
    this.editor.load(await ImageCodec.decode(file), file.name);
    this.handle = handle;
  }

  async save() {
    if (!this.handle || !ImageCodec.canWrite(this.handle.name)) return this.saveAs();
    await this.write(this.handle);
  }

  async saveAs() {
    let name = this.editor.fileName;
    if (!ImageCodec.canWrite(name)) name = name.replace(/\.[^.]*$/, "") + ".bmp";
    const handle = await window.showSaveFilePicker({ suggestedName: name, types: SAVE_TYPES });
    await this.write(handle);
    this.handle = handle;
  }

  async write(handle) {
    this.editor.flush();
    const blob = await ImageCodec.encode(this.editor.canvas, handle.name);
    const stream = await handle.createWritable();
    await stream.write(blob);
    await stream.close();
    this.editor.setFile(handle.name, false);
  }
}
