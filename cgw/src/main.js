import { Editor } from "./editor.js";
import { Options, Palette, StatusBar } from "./panels.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { SizeDialog, ConfirmDialog } from "./dialog.js";
import { FileManager } from "./files.js";
import { SelectTool } from "./tools/select.js";
import { PencilTool, BrushTool, SprayTool, EraserTool, PointTool } from "./tools/paint.js";
import { FillTool, PickerTool } from "./tools/fill.js";
import { TextTool } from "./tools/text.js";
import {
  LineTool, RectTool, RoundRectTool, EllipseTool, PolygonTool, TRIANGLE, RHOMBUS, HEXAGON, ARROW, STAR,
} from "./tools/shapes.js";

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
const sizeDialog = new SizeDialog();
const files = new FileManager(editor, sizeDialog, new ConfirmDialog());
const select = new SelectTool(editor);
const pencil = new PencilTool(editor);

const tools = [
  select, pencil, new BrushTool(editor), new SprayTool(editor), new EraserTool(editor),
  new FillTool(editor), new PickerTool(editor), new TextTool(editor), new PointTool(editor),
  new LineTool(editor), new RectTool(editor), new RoundRectTool(editor), new EllipseTool(editor),
  new PolygonTool(editor, "Трикутник", TRIANGLE), new PolygonTool(editor, "Ромб", RHOMBUS),
  new PolygonTool(editor, "Шестикутник", HEXAGON), new PolygonTool(editor, "Стрілка", ARROW),
  new PolygonTool(editor, "Зірка", STAR),
];

// ---------- команди меню ----------
const hasSelection = () => select.rect !== null;

async function exit() {
  if (!(await files.confirmDiscard())) return;
  window.close(); // спрацьовує, лише якщо вкладку відкрив скрипт
  $("exit-screen").hidden = false;
}

new Menu($("menubar"), [
  { title: "Файл", items: [
    { label: "Створити…", action: () => files.create() },
    { label: "Відкрити…", key: "Ctrl+O", action: () => files.open() },
    { label: "Записати", key: "Ctrl+S", action: () => files.save() },
    { label: "Записати як…", key: "Ctrl+Shift+S", action: () => files.saveAs() },
    null,
    { label: "Вихід", action: exit },
  ] },
  { title: "Правка", items: [
    { label: "Скасувати", key: "Ctrl+Z", action: () => editor.undo(), enabled: () => editor.history.canUndo },
    { label: "Повторити", key: "Ctrl+Y", action: () => editor.redo(), enabled: () => editor.history.canRedo },
    null,
    { label: "Видалити", key: "Del", action: () => select.erase(), enabled: hasSelection },
    null,
    { label: "Виділити все", key: "Ctrl+A", action: () => { editor.setTool(select); select.selectAll(); } },
    { label: "Зняти виділення", key: "Esc", action: () => editor.tool.finish() },
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

window.addEventListener("beforeunload", (e) => editor.modified && e.preventDefault());
$("exit-back").addEventListener("click", () => ($("exit-screen").hidden = true));

editor.create(800, 600);
editor.setTool(pencil);
if (!window.showOpenFilePicker) alert("Для роботи з файлами потрібен Google Chrome або Microsoft Edge");
