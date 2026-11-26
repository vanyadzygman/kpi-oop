// Панель інструментів (Toolbar) з підказками (Tooltips)
export class Toolbar {
  constructor(root, editor, tools) {
    this.buttons = new Map();
    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    document.body.append(this.tooltip);

    for (const tool of tools) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tool-btn";
      btn.setAttribute("aria-label", tool.name);
      btn.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">${tool.icon}</svg>`;
      btn.addEventListener("click", () => editor.setTool(tool));
      btn.addEventListener("mouseenter", () => this.showTip(btn, tool.tip));
      btn.addEventListener("mouseleave", () => this.tooltip.classList.remove("visible"));
      root.append(btn);
      this.buttons.set(tool, btn);
    }
    editor.on("tool", (tool) => this.update(tool));
  }

  showTip(btn, text) {
    const r = btn.getBoundingClientRect();
    this.tooltip.textContent = text;
    this.tooltip.style.left = r.right + 6 + "px";
    this.tooltip.style.top = r.top + 6 + "px";
    this.tooltip.classList.add("visible");
  }

  update(active) {
    for (const [tool, btn] of this.buttons) btn.classList.toggle("active", tool === active);
  }
}
