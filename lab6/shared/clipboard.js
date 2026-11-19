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

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function writeClipboard(text, retries = 6, delay = 250) {
  for (let i = 0; i <= retries; i++) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
    if (i < retries) await pause(delay);
  }
  return false;
}

export async function readClipboard(timeout = 8000, delay = 250) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    try {
      return await Promise.race([
        navigator.clipboard.readText(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), Math.max(100, end - Date.now())),
        ),
      ]);
    } catch {
      await pause(delay);
    }
  }
  return null;
}
