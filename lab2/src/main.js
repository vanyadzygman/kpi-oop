import { MyEditor } from "./MyEditor.js";
import { initMenu, markCheckedType } from "./menu.js";

const canvas = document.getElementById("canvas");
const editor = new MyEditor(canvas, markCheckedType);

initMenu(editor);
