import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectShape } from "./shapes/RectShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";
import { LineWithCirclesShape } from "./shapes/LineWithCirclesShape.js";
import { CubeShape } from "./shapes/CubeShape.js";

const svg = (body) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const TOOLS = [
  {
    type: "point",
    name: "Крапка",
    create: () => new PointShape(),
    icon: svg(`<circle cx="12" cy="12" r="2.5" fill="currentColor"/>`),
  },
  {
    type: "line",
    name: "Лінія",
    create: () => new LineShape(),
    icon: svg(`<line x1="4" y1="20" x2="20" y2="4"/>`),
  },
  {
    type: "rect",
    name: "Прямокутник",
    create: () => new RectShape(),
    icon: svg(`<rect x="3.5" y="6" width="17" height="12"/>`),
  },
  {
    type: "ellipse",
    name: "Еліпс",
    create: () => new EllipseShape(),
    icon: svg(`<ellipse cx="12" cy="12" rx="9" ry="6"/>`),
  },
  {
    type: "linecircles",
    name: "Лінія з кружечками",
    create: () => new LineWithCirclesShape(),
    icon: svg(`<circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><line x1="7.3" y1="16.7" x2="16.7" y2="7.3"/>`),
  },
  {
    type: "cube",
    name: "Каркас куба",
    create: () => new CubeShape(),
    icon: svg(`<rect x="3.5" y="9.5" width="11" height="11"/><rect x="9.5" y="3.5" width="11" height="11"/><line x1="3.5" y1="9.5" x2="9.5" y2="3.5"/><line x1="14.5" y1="9.5" x2="20.5" y2="3.5"/><line x1="14.5" y1="20.5" x2="20.5" y2="14.5"/><line x1="3.5" y1="20.5" x2="9.5" y2="14.5"/>`),
  },
];

export function hasType(type) {
  return TOOLS.some((t) => t.type === type);
}

export function toolName(type) {
  const tool = TOOLS.find((t) => t.type === type);
  return tool ? tool.name : type;
}

export function createShape(type) {
  const tool = TOOLS.find((t) => t.type === type);
  const shape = tool.create();
  shape.type = type;
  return shape;
}
