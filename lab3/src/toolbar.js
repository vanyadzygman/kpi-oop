export class Toolbar {
  constructor(root, editor, tools) {
    this.root = root;
    this.editor = editor;
    this.buttons = new Map();

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    document.body.appendChild(this.tooltip);

    this.build(tools);
    this.update(editor.type);
  }

  build(tools) {
    for (const tool of tools) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tool-btn";
      btn.dataset.type = tool.type;
      btn.dataset.tip = tool.name;
      btn.setAttribute("aria-label", tool.name);
      btn.innerHTML = tool.icon;

      btn.addEventListener("click", () => this.onClick(tool.type));
      for (const ev of ["mouseenter", "mouseleave", "focus", "blur"]) {
        btn.addEventListener(ev, (e) => this.onNotify(e));
      }

      this.root.appendChild(btn);
      this.buttons.set(tool.type, btn);
    }
  }

  onClick(type) {
    this.editor.setType(type);
  }

  onNotify(e) {
    const btn = e.currentTarget;
    if (e.type === "mouseenter" || e.type === "focus") {
      const r = btn.getBoundingClientRect();
      this.tooltip.textContent = btn.dataset.tip;
      this.tooltip.style.left = r.left + "px";
      this.tooltip.style.top = r.bottom + 6 + "px";
      this.tooltip.classList.add("visible");
    } else {
      this.tooltip.classList.remove("visible");
    }
  }

  update(type) {
    for (const [t, btn] of this.buttons) {
      const active = t === type;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    }
  }
}
