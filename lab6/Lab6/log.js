export class Log {
  constructor(list) {
    this.list = list;
  }

  add(kind, text, extra = "") {
    const li = document.createElement("li");
    li.className = (kind + " " + extra).trim();
    const time = new Date().toLocaleTimeString("uk-UA");
    li.textContent = time + "  " + text;
    this.list.appendChild(li);
    li.scrollIntoView({ block: "nearest" });
  }

  info(text) {
    this.add("info", text);
  }

  ok(text) {
    this.add("ok", text);
  }

  error(text) {
    this.add("error", text);
  }

  separator(text) {
    this.add("info", text, "sep");
  }
}
