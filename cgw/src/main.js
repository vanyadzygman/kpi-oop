import { Editor } from "./editor.js";
import { Options, Palette, StatusBar } from "./panels.js";
import { PencilTool } from "./tools/paint.js";

const $ = (id) => document.getElementById(id);

const editor = new Editor({
  canvas: $("image-canvas"),
  overlay: $("overlay-canvas"),
  sheet: $("sheet"),
  viewport: $("viewport"),
  options: new Options(),
  palette: new Palette(),
  status: new StatusBar(),
});
const pencil = new PencilTool(editor);

editor.create(800, 600);
editor.setTool(pencil);
