const CODES = { "=": "Equal", "-": "Minus", Del: "Delete", Esc: "Escape" };

function keyCode(key) {
  if (CODES[key]) return CODES[key];
  return /^\d$/.test(key) ? "Digit" + key : "Key" + key;
}

export class Menu {
  constructor(root, menus) {
    this.root = root;
    this.items = [];
    for (const menu of menus) this.build(menu);
    document.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => this.onKey(e));
  }

  build({ title, items }) {
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.innerHTML = `<div class="title">${title}</div><div class="dropdown"></div>`;
    for (const item of items) {
      const el = document.createElement("div");
      if (item) {
        el.className = "item";
        el.innerHTML = `<span>${item.label}</span><span class="shortcut">${item.key ?? ""}</span>`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!this.enabled(item)) return;
          this.close();
          this.run(item);
        });
        this.items.push({ ...item, el });
      } else {
        el.className = "separator";
      }
      menu.lastChild.append(el);
    }
    menu.firstChild.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasOpen = menu.classList.contains("open");
      this.close();
      if (!wasOpen) this.open(menu);
    });
    menu.addEventListener("mouseenter", () => {
      if (this.root.querySelector(".menu.open") && !menu.classList.contains("open")) {
        this.close();
        this.open(menu);
      }
    });
    this.root.append(menu);
  }

  open(menu) {
    for (const item of this.items)
      item.el.classList.toggle("disabled", !this.enabled(item));
    menu.classList.add("open");
  }

  close() {
    this.root.querySelectorAll(".menu.open").forEach((m) => m.classList.remove("open"));
  }

  enabled(item) {
    return item.enabled ? item.enabled() : true;
  }
  async run(item) {
    try {
      await item.action();
    } catch (e) {
      if (e.name !== "AbortError") alert("Помилка: " + e.message);
    }
  }

  onKey(e) {
    const item = this.items.find((it) => it.key && this.matches(e, it.key));
    if (!item) return;
    e.preventDefault();
    this.close();
    if (this.enabled(item)) this.run(item);
  }

  matches(e, key) {
    const parts = key.split("+");
    const main = parts.pop();
    return (
      e.code === keyCode(main) &&
      !e.altKey &&
      e.ctrlKey === parts.includes("Ctrl") &&
      e.shiftKey === parts.includes("Shift")
    );
  }
}
