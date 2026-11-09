export class Menu {
  constructor(editor, tools, actions = {}, checks = {}) {
    this.editor = editor;
    this.actions = actions;
    this.checks = checks;
    this.menus = [...document.querySelectorAll(".menu")];
    this.buildObjectsMenu(tools);
    this.bind();
  }

  buildObjectsMenu(tools) {
    const dropdown = document.getElementById("objects-dropdown");
    dropdown.textContent = "";
    for (const tool of tools) {
      const item = document.createElement("div");
      item.className = "item";
      item.dataset.type = tool.type;
      item.textContent = tool.name;
      dropdown.appendChild(item);
    }
  }

  bind() {
    for (const menu of this.menus) {
      menu.querySelector(".title").addEventListener("click", (e) => this.onTitleClick(e, menu));
    }
    document.addEventListener("click", () => this.closeAll());
    document.querySelectorAll(".item").forEach((item) => {
      item.addEventListener("click", () => this.onItemClick(item));
    });
  }

  closeAll() {
    this.menus.forEach((m) => m.classList.remove("open"));
  }

  onTitleClick(e, menu) {
    e.stopPropagation();
    const wasOpen = menu.classList.contains("open");
    this.closeAll();
    if (!wasOpen) {
      this.onInitMenuPopup(menu);
      menu.classList.add("open");
    }
  }

  onInitMenuPopup(menu) {
    menu.querySelectorAll(".item[data-type]").forEach((el) => {
      el.classList.toggle("checked", el.dataset.type === this.editor.type);
    });
    menu.querySelectorAll(".item[data-action]").forEach((el) => {
      const check = this.checks[el.dataset.action];
      if (check) el.classList.toggle("checked", check());
    });
  }

  onItemClick(item) {
    const { type, action } = item.dataset;
    if (type) {
      this.editor.setType(type);
    } else if (action && this.actions[action]) {
      this.actions[action]();
    }
  }
}
