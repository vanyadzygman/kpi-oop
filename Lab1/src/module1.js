import { createDialogShell, closeDialog } from "./utils.js";

const GROUPS = ["ІМ-51", "ІМ-52", "ІМ-53", "ІМ-54", "ІМ-55", "ІМ-о51"];

export function showListDialog(onResult) {
  const { overlay, dialog } = createDialogShell("Робота1: виберіть групу");

  const select = document.createElement("select");
  select.size = GROUPS.length;
  GROUPS.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    select.appendChild(option);
  });
  select.selectedIndex = 0;
  dialog.appendChild(select);

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
    const chosen = select.value;
    closeDialog(overlay);
    onResult(chosen);
  }

  function onCancelClick() {
    closeDialog(overlay);
  }
}
