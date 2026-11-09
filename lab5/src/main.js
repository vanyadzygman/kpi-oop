import { MyEditor } from "./myeditor.js";
import { MyTable } from "./mytable.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { TOOLS } from "./tools.js";
import { shapesToCsv, csvToShapes, downloadText, readTextFile } from "./shapefile.js";

const editor = MyEditor.getInstance(document.getElementById("canvas"));
const table = new MyTable();

function saveFile() {
  const shapes = editor.getShapes();
  if (shapes.length === 0) {
    alert("Немає об'єктів для збереження");
    return;
  }
  downloadText("shapes.csv", shapesToCsv(shapes));
}

async function openFile() {
  const text = await readTextFile();
  if (text === null) return;
  const { shapes, bad } = csvToShapes(text);
  if (shapes.length === 0) {
    alert("У файлі немає жодного коректного об'єкта");
    return;
  }
  const dropped = editor.loadShapes(shapes);
  const notes = [];
  if (bad) notes.push("пропущено некоректних рядків: " + bad);
  if (dropped) notes.push("не вмістилося об'єктів: " + dropped);
  if (notes.length)
    alert("Завантажено об'єктів: " + (shapes.length - dropped) + "; " + notes.join("; "));
}

const actions = {
  save: saveFile,
  open: openFile,
  "toggle-table": () => table.toggle(),
  clear: () => editor.clear(),
  about: () => alert("Лабораторна робота №5. Графічний редактор об'єктів."),
};

new Menu(editor, TOOLS, actions, { "toggle-table": () => table.isOpen() });
const toolbar = new Toolbar(document.getElementById("toolbar"), editor, TOOLS);

editor.on("type", (type) => toolbar.update(type));
editor.on("shapes", () => table.setRows(editor.describeShapes()));

table.onSelect = (index) => editor.select(index);
table.onDelete = (index) => editor.removeShape(index);
table.onClose = () => editor.select(-1);

table.setRows(editor.describeShapes());

window.addEventListener("beforeunload", () => table.close());
