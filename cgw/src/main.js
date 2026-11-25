import { Editor } from "./editor.js";
import { Options, Palette, StatusBar } from "./panels.js";
import { Menu } from "./menu.js";
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

new Menu($("menubar"), [
  {
    title: "Вигляд",
    items: [
      {
        label: "Збільшити",
        key: "Ctrl+=",
        action: () => editor.setZoom(editor.zoom * 2),
      },
      { label: "Зменшити", key: "Ctrl+-", action: () => editor.setZoom(editor.zoom / 2) },
      { label: "Реальний розмір", key: "Ctrl+0", action: () => editor.setZoom(1) },
    ],
  },
  {
    title: "Довідка",
    items: [
      {
        label: "Про програму",
        action: () =>
          alert(
            "Растровий графічний редактор\nРГР з ООП, варіант 11\nІМ-51, Дзигман Іван",
          ),
      },
    ],
  },
]);

editor.create(800, 600);
editor.setTool(pencil);
