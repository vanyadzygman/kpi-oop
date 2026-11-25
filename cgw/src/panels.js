const SIZES = [1, 2, 3, 4, 5, 8, 12, 16, 24];

function fillSelect(id, items, value) {
  const el = document.getElementById(id);
  for (const [v, text] of items) el.add(new Option(text, v));
  el.value = value;
  return el;
}

export class Options {
  constructor() {
    this.sizeEl = fillSelect(
      "opt-size",
      SIZES.map((s) => [s, s + " px"]),
      3,
    );
  }

  get size() {
    return Number(this.sizeEl.value);
  }
}

export class Palette {
  constructor() {
    this.primaryEl = document.getElementById("color-primary");
    this.secondaryEl = document.getElementById("color-secondary");
    this.primary = "#000000";
    this.secondary = "#ffffff";
  }

  get primary() {
    return this.primaryEl.value;
  }
  set primary(color) {
    this.primaryEl.value = color;
  }
  get secondary() {
    return this.secondaryEl.value;
  }
  set secondary(color) {
    this.secondaryEl.value = color;
  }
}

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
