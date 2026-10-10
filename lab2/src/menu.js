export function markCheckedType(type) {
  document.querySelectorAll("#objects-dropdown .item").forEach((el) => {
    el.classList.toggle("checked", el.dataset.type === type);
  });
}

export function initMenu(editor) {
  const menus = document.querySelectorAll(".menu");

  menus.forEach((menu) => {
    menu.querySelector(".title").addEventListener("click", (e) => {
      const wasOpen = menu.classList.contains("open");
      menus.forEach((m) => m.classList.remove("open"));
      if (!wasOpen) menu.classList.add("open");
      e.stopPropagation();
    });
  });

  document.addEventListener("click", () => {
    menus.forEach((m) => m.classList.remove("open"));
  });

  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", () => {
      const { type, action } = item.dataset;
      if (type) {
        editor.setType(type);
      } else if (action === "clear") {
        editor.clear();
      } else if (action === "about") {
        alert("Лабораторна робота №2. Графічний редактор об'єктів.");
      }
    });
  });
}
