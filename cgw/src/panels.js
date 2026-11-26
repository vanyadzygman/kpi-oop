const SIZES = [1, 2, 3, 4, 5, 8, 12, 16, 24];
const FILL_MODES = [["stroke", "Контур"], ["fill", "Заливка"], ["both", "Контур і заливка"]];
const FONTS = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia", "Comic Sans MS"];
const SWATCHES = [
  "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4",
  "#ffffff", "#c3c3c3", "#b97a57", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#99d9ea", "#7092be", "#c8bfe7",
];

function fillSelect(id, items, value) {
  const el = document.getElementById(id);
  for (const [v, text] of items) el.add(new Option(text, v));
  el.value = value;
  return el;
}

// Панель опцій: товщина ліній, режим фігур, шрифт
export class Options {
  constructor() {
    this.sizeEl = fillSelect("opt-size", SIZES.map((s) => [s, s + " px"]), 3);
    this.fillEl = fillSelect("opt-fill", FILL_MODES, "stroke");
    this.fontEl = fillSelect("opt-font-family", FONTS.map((f) => [f, f]), "Arial");
    this.fontSizeEl = document.getElementById("opt-font-size");
    this.fontSizeEl.value = 24;
  }

  get size() { return Number(this.sizeEl.value); }
  get fillMode() { return this.fillEl.value; }
  get fontSize() { return Math.max(6, Number(this.fontSizeEl.value) || 24); }

  font(scale = 1) {
    return `${this.fontSize * scale}px "${this.fontEl.value}"`;
  }
}

// Палітра: колір 1 (основний) та колір 2 (фон)
export class Palette {
  constructor() {
    this.primaryEl = document.getElementById("color-primary");
    this.secondaryEl = document.getElementById("color-secondary");
    this.primary = "#000000";
    this.secondary = "#ffffff";
    document.getElementById("swap-colors").addEventListener("click", () => this.swap());

    const box = document.getElementById("swatches");
    for (const color of SWATCHES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch";
      btn.title = color;
      btn.style.background = color;
      btn.addEventListener("click", () => (this.primary = color));
      btn.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.secondary = color;
      });
      box.append(btn);
    }
  }

  get primary() { return this.primaryEl.value; }
  set primary(color) { this.primaryEl.value = color; }
  get secondary() { return this.secondaryEl.value; }
  set secondary(color) { this.secondaryEl.value = color; }

  swap() {
    [this.primary, this.secondary] = [this.secondary, this.primary];
  }
}

// Рядок стану: позиція курсора, виділення, розміри, масштаб, файл
export class StatusBar {
  constructor() {
    this.fields = {};
    for (const key of ["pos", "sel", "size", "zoom", "file"]) {
      this.fields[key] = document.getElementById("st-" + key);
    }
  }

  set(key, text) {
    this.fields[key].textContent = text;
  }
}
