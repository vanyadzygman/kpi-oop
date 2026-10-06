let currentOverlay = null;

export function closePreviousDialog() {
  if (currentOverlay) {
    currentOverlay.remove();
    [];
    currentOverlay = null;
  }
}

export function createDialogShell(titleText) {
  closePreviousDialog();

  const overlay = document.createElement("div");
  overlay.className = "overlay";

  const dialog = document.createElement("div");
  dialog.className = "dialog";

  const title = document.createElement("h3");
  title.textContent = titleText;
  dialog.appendChild(title);

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  currentOverlay = overlay;
  return { overlay, dialog };
}

export function closeDialog(overlay) {
  overlay.remove();
  if (currentOverlay === overlay) currentOverlay = null;
}
