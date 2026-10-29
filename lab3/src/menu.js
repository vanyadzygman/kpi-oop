export class Menu {
  constructor(editor, tools) {
    this.editor = editor;
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
      menu
        .querySelector(".title")
        .addEventListener("click", (e) => this.onTitleClick(e, menu));
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
  }

  onItemClick(item) {
    const { type, action } = item.dataset;
    if (type) {
      this.editor.setType(type);
    } else if (action === "clear") {
      this.editor.clear();
    } else if (action === "about") {
      alert("Лабораторна робота №3. Графічний редактор об'єктів. Ж = 12");
    }
  }
}
