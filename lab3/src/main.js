import { MyEditor } from "./myeditor.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { TOOLS } from "./config.js";

const editor = new MyEditor(document.getElementById("canvas"));
new Menu(editor, TOOLS);
const toolbar = new Toolbar(document.getElementById("toolbar"), editor, TOOLS);

editor.onTypeChange = (type) => toolbar.update(type);
