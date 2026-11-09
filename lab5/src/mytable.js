export class MyTable {
  constructor() {
    this.onSelect = () => {};
    this.onDelete = () => {};
    this.onClose = () => {};

    this.rows = [];
    this.selected = -1;
    this.placed = false;
    this.drag = null;

    this.build();
  }

  build() {
    this.root = document.createElement("div");
    this.root.className = "table-window";
    this.root.tabIndex = -1;

    this.titleBar = document.createElement("div");
    this.titleBar.className = "tw-title";
    const title = document.createElement("span");
    title.textContent = "Таблиця графічних об'єктів";
    this.closeBtn = document.createElement("button");
    this.closeBtn.type = "button";
    this.closeBtn.className = "tw-close";
    this.closeBtn.setAttribute("aria-label", "Закрити");
    this.closeBtn.textContent = "×";
    this.titleBar.append(title, this.closeBtn);

    const scroll = document.createElement("div");
    scroll.className = "tw-scroll";
    const table = document.createElement("table");
    table.className = "tw-table";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const text of ["Назва", "x1", "y1", "x2", "y2"]) {
      const th = document.createElement("th");
      th.textContent = text;
      headRow.appendChild(th);
    }
    head.appendChild(headRow);
    this.body = document.createElement("tbody");
    table.append(head, this.body);
    scroll.appendChild(table);

    const footer = document.createElement("div");
    footer.className = "tw-footer";
    this.countLabel = document.createElement("span");
    this.deleteBtn = document.createElement("button");
    this.deleteBtn.type = "button";
    this.deleteBtn.className = "tw-delete";
    this.deleteBtn.textContent = "Видалити";
    footer.append(this.countLabel, this.deleteBtn);

    this.root.append(this.titleBar, scroll, footer);
    document.body.appendChild(this.root);

    this.closeBtn.addEventListener("click", () => this.close());
    this.deleteBtn.addEventListener("click", () => this.deleteSelected());
    this.root.addEventListener("keydown", (e) => this.onKeyDown(e));
    this.titleBar.addEventListener("mousedown", (e) => this.onDragStart(e));
    document.addEventListener("mousemove", (e) => this.onDragMove(e));
    document.addEventListener("mouseup", () => this.onDragEnd());

    this.render();
  }

  isOpen() {
    return this.root.classList.contains("open");
  }

  open() {
    if (this.isOpen()) return;
    if (!this.placed) {
      this.root.style.left = Math.max(10, window.innerWidth - 400) + "px";
      this.root.style.top = "90px";
      this.placed = true;
    }
    this.root.classList.add("open");
  }

  close() {
    if (!this.isOpen()) return;
    this.root.classList.remove("open");
    this.selected = -1;
    this.render();
    this.onClose();
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  setRows(rows) {
    this.rows = rows;
    this.selected = -1;
    this.render();
  }

  select(index) {
    this.selected = index;
    this.updateSelection();
    this.onSelect(index);
  }

  deleteSelected() {
    if (this.selected < 0) return;
    this.onDelete(this.selected);
  }

  render() {
    this.body.textContent = "";
    this.rows.forEach((row, i) => {
      const tr = document.createElement("tr");
      for (const value of [row.name, row.x1, row.y1, row.x2, row.y2]) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      }
      tr.addEventListener("click", () => this.select(i === this.selected ? -1 : i));
      this.body.appendChild(tr);
    });
    this.countLabel.textContent = "Об'єктів: " + this.rows.length;
    this.updateSelection();
  }

  updateSelection() {
    [...this.body.children].forEach((tr, i) => {
      tr.classList.toggle("selected", i === this.selected);
    });
    this.deleteBtn.disabled = this.selected < 0;
  }

  onKeyDown(e) {
    if (e.key === "Delete") this.deleteSelected();
    else if (e.key === "Escape") this.close();
  }

  onDragStart(e) {
    if (e.target === this.closeBtn) return;
    const r = this.root.getBoundingClientRect();
    this.drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
  }

  onDragMove(e) {
    if (!this.drag) return;
    const x = Math.min(Math.max(0, e.clientX - this.drag.dx), window.innerWidth - 60);
    const y = Math.min(Math.max(0, e.clientY - this.drag.dy), window.innerHeight - 40);
    this.root.style.left = x + "px";
    this.root.style.top = y + "px";
  }

  onDragEnd() {
    this.drag = null;
  }
}
