export function arrangeSelf({ left, top, width, height }) {
  try {
    window.moveTo(left, top);
    window.resizeTo(width, height);
    window.focus();
  } catch {}
}
