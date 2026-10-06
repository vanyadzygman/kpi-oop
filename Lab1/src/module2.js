import { createDialogShell, closeDialog } from "./utils.js";

export function showTextDialog(onResult) {
  const { overlay, dialog } = createDialogShell("Робота2: введіть текст");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Введіть текст...";
  dialog.appendChild(input);
  input.focus();

  const buttons = document.createElement("div");
  buttons.className = "dialog-buttons";

  const btnCancel = document.createElement("button");
  btnCancel.textContent = "Відміна";
  btnCancel.onclick = () => onCancelClick();

  const btnOk = document.createElement("button");
  btnOk.textContent = "Так";
  btnOk.onclick = () => onOkClick();

  buttons.appendChild(btnCancel);
  buttons.appendChild(btnOk);
  dialog.appendChild(buttons);

  function onOkClick() {
    const text = input.value;
    closeDialog(overlay);
    onResult(text);
  }

  function onCancelClick() {
    closeDialog(overlay);
  }
}
