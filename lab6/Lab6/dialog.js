const MAX_N = 5000;

function parseNumber(text) {
  const t = text.trim().replace(",", ".");
  return t === "" ? NaN : Number(t);
}

export function validateParams(nText, minText, maxText) {
  const n = parseNumber(nText);
  const min = parseNumber(minText);
  const max = parseNumber(maxText);
  if (!Number.isInteger(n) || n < 1 || n > MAX_N)
    return { error: "n має бути цілим числом від 1 до " + MAX_N };
  if (!Number.isFinite(min) || !Number.isFinite(max))
    return { error: "Min і Max мають бути числами" };
  if (min > max) return { error: "Min не може бути більшим за Max" };
  return { values: { n, min, max } };
}

export function askParams() {
  const dialog = document.getElementById("params-dialog");
  const form = document.getElementById("params-form");
  const error = document.getElementById("params-error");
  const cancel = document.getElementById("params-cancel");
  const fields = ["field-n", "field-min", "field-max"].map((id) =>
    document.getElementById(id),
  );

  return new Promise((resolve) => {
    let result = null;
    error.textContent = "";

    form.onsubmit = (e) => {
      e.preventDefault();
      const checked = validateParams(fields[0].value, fields[1].value, fields[2].value);
      if (checked.error) {
        error.textContent = checked.error;
        return;
      }
      result = checked.values;
      dialog.close();
    };
    cancel.onclick = () => dialog.close();
    dialog.onclose = () => resolve(result);

    dialog.showModal();
  });
}
