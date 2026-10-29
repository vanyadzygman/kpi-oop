export const SHAPES_COUNT = 112;
export const RUBBER_COLOR = "#000";
export const RUBBER_DASH = [];
export const OUTLINE_COLOR = "#000";
export const RECT_FILL = "#ffeb3b";
export const DEFAULT_TYPE = "rect";

const svg = (body) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;

export const TOOLS = [
  {
    type: "point",
    name: "Крапка",
    icon: svg(`<circle cx="12" cy="12" r="3.5" fill="currentColor"/>`),
  },
  {
    type: "line",
    name: "Лінія",
    icon: svg(
      `<line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    ),
  },
  {
    type: "rect",
    name: "Прямокутник",
    icon: svg(
      `<rect x="3.5" y="6" width="17" height="12" fill="none" stroke="currentColor" stroke-width="2"/>`,
    ),
  },
  {
    type: "ellipse",
    name: "Еліпс",
    icon: svg(
      `<ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="currentColor" stroke-width="2"/>`,
    ),
  },
];
