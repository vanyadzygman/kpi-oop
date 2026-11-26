import { Editor } from "./editor.js";
import { Options, Palette, StatusBar } from "./panels.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { PencilTool, BrushTool, SprayTool, EraserTool, PointTool } from "./tools/paint.js";
import { LineTool, RectTool, EllipseTool } from "./tools/shapes.js";

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

const tools = [
  pencil, new BrushTool(editor), new SprayTool(editor), new EraserTool(editor),
  new PointTool(editor),
  new LineTool(editor), new RectTool(editor), new EllipseTool(editor),
];

new Menu($("menubar"), [
  { title: "Правка", items: [
    { label: "Скасувати", key: "Ctrl+Z", action: () => editor.undo(), enabled: () => editor.history.canUndo },
    { label: "Повторити", key: "Ctrl+Y", action: () => editor.redo(), enabled: () => editor.history.canRedo },
  ] },
  { title: "Вигляд", items: [
    { label: "Збільшити", key: "Ctrl+=", action: () => editor.setZoom(editor.zoom * 2) },
    { label: "Зменшити", key: "Ctrl+-", action: () => editor.setZoom(editor.zoom / 2) },
    { label: "Реальний розмір", key: "Ctrl+0", action: () => editor.setZoom(1) },
  ] },
  { title: "Довідка", items: [
    { label: "Про програму", action: () => alert("Растровий графічний редактор\nРГР з ООП, варіант 11\nІМ-51, Дзигман Іван") },
  ] },
]);

new Toolbar($("toolbar"), editor, tools);

editor.create(800, 600);
editor.setTool(pencil);
