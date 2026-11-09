const TAG = "LAB6";

export function encodeVector(runId, values) {
  return [TAG + ";" + runId + ";" + values.length, ...values.map((v) => String(v))].join(
    "\n",
  );
}

export function decodeVector(text, runId) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  const [tag, id, count] = lines[0].split(";");
  if (tag !== TAG || id !== runId) return null;
  const values = lines.slice(1).map(Number);
  if (values.length !== Number(count) || values.some((v) => !Number.isFinite(v)))
    return null;
  return values;
}

export async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function readClipboard(timeout = 8000) {
  try {
    return await Promise.race([
      navigator.clipboard.readText(),
      new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
    ]);
  } catch {
    return null;
  }
}
