// Базовий модальний діалог на основі елемента <dialog>
class Dialog {
  constructor(html) {
    this.el = document.createElement("dialog");
    this.el.className = "form-dialog";
    this.el.innerHTML = `<form method="dialog">${html}</form>`;
    this.form = this.el.firstChild;
    document.body.append(this.el);
  }

  // Повертає value натиснутої кнопки ("" — скасування або Esc)
  show() {
    this.el.returnValue = "";
    this.el.showModal();
    return new Promise((resolve) => {
      this.el.addEventListener("close", () => resolve(this.el.returnValue), { once: true });
    });
  }
}

// Діалог введення розмірів растру
export class SizeDialog extends Dialog {
  constructor() {
    super(`<h3></h3>
      <label>Ширина, px <input name="w" type="number" min="1" max="8000" required></label>
      <label>Висота, px <input name="h" type="number" min="1" max="8000" required></label>
      <div class="buttons"><button value="ok">OK</button><button value="" formnovalidate>Скасувати</button></div>`);
  }

  async ask(title, width, height) {
    this.form.querySelector("h3").textContent = title;
    this.form.w.value = width;
    this.form.h.value = height;
    if ((await this.show()) !== "ok") return null;
    return { width: Number(this.form.w.value), height: Number(this.form.h.value) };
  }
}
