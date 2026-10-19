function intersectSegmentCircle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  R: number
): number[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const fx = x1 - cx;
  const fy = y1 - cy;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - R * R;
  const discriminant = b * b - 4 * a * c;

  if (a === 0 || discriminant < 0) return [];

  const sqrtDisc = Math.sqrt(discriminant);
  const t1 = (-b - sqrtDisc) / (2 * a);
  const t2 = (-b + sqrtDisc) / (2 * a);

  const results: number[] = [];
  if (t1 > 1e-6 && t1 < 1 - 1e-6) results.push(t1);
  if (t2 > 1e-6 && t2 < 1 - 1e-6) results.push(t2);
  return results.sort((n1, n2) => n1 - n2);
}

export function createWordboxPath(
  w: number,
  h: number,
  cx: number,
  cy: number,
  R: number,
  cornerRad = 14
): string {
  const fmt = (n: number) => n.toFixed(2);
  const isInside = (x: number, y: number) => (x - cx) ** 2 + (y - cy) ** 2 < R * R;

  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];

  const intersections = corners.map((pt, i) => {
    const [x1, y1] = pt;
    const [x2, y2] = corners[(i + 1) % 4];
    return intersectSegmentCircle(x1, y1, x2, y2, cx, cy, R).map((t) => ({
      x: x1 + (x2 - x1) * t,
      y: y1 + (y2 - y1) * t,
    }));
  });

  const hasIntersections = intersections.some((arr) => arr.length > 0);

  if (!hasIntersections) {
    const cr = cornerRad;
    return `M ${fmt(cr)} 0 L ${fmt(w - cr)} 0 Q ${fmt(w)} 0 ${fmt(w)} ${fmt(cr)} L ${fmt(w)} ${fmt(h - cr)} Q ${fmt(w)} ${fmt(h)} ${fmt(w - cr)} ${fmt(h)} L ${fmt(cr)} ${fmt(h)} Q 0 ${fmt(h)} 0 ${fmt(h - cr)} L 0 ${fmt(cr)} Q 0 0 ${fmt(cr)} 0 Z`;
  }

  type PathNode =
    | { kind: "corner"; i: number; x: number; y: number; in: boolean }
    | { kind: "cross"; x: number; y: number };

  const nodes: PathNode[] = [];
  for (let i = 0; i < 4; i++) {
    nodes.push({
      kind: "corner",
      i,
      x: corners[i][0],
      y: corners[i][1],
      in: isInside(corners[i][0], corners[i][1]),
    });
    for (const cross of intersections[i]) {
      nodes.push({ kind: "cross", x: cross.x, y: cross.y });
    }
  }

  const cornerControls = [
    { in: [0, cornerRad], v: [0, 0], out: [cornerRad, 0] },
    { in: [w - cornerRad, 0], v: [w, 0], out: [w, cornerRad] },
    { in: [w, h - cornerRad], v: [w, h], out: [w - cornerRad, h] },
    { in: [cornerRad, h], v: [0, h], out: [0, h - cornerRad] },
  ];

  const total = nodes.length;
  const distToCut = (idx: number) => {
    let minD = Infinity;
    const relatedCrosses = [...intersections[idx], ...intersections[(idx + 3) % 4]];
    for (const cross of relatedCrosses) {
      minD = Math.min(minD, Math.hypot(cross.x - corners[idx][0], cross.y - corners[idx][1]));
    }
    return minD;
  };

  const arcSegment = (x1: number, y1: number, x2: number, y2: number) => {
    const crossProd = (x1 - cx) * (y2 - cy) - (y1 - cy) * (x2 - cx);
    const sweep = crossProd < 0 ? 0 : 1;
    return `A ${fmt(R)} ${fmt(R)} 0 0 ${sweep} ${fmt(x2)} ${fmt(y2)} `;
  };

  let startIdx = nodes.findIndex((n) => n.kind === "corner" && !n.in);
  if (startIdx < 0) startIdx = 0;

  let pathStr = "";
  let isPenDown = false;
  let isNextCrossArc = true;
  let lastCross: { x: number; y: number } | null = null;

  const emitPoint = (x: number, y: number) => {
    pathStr += `${isPenDown ? "L" : "M"} ${fmt(x)} ${fmt(y)} `;
    isPenDown = true;
  };

  for (let k = 0; k < total; k++) {
    const node = nodes[(startIdx + k) % total];
    if (node.kind === "corner") {
      if (node.in) continue;
      if (distToCut(node.i) > cornerRad + 1) {
        const ctrl = cornerControls[node.i];
        emitPoint(ctrl.in[0], ctrl.in[1]);
        pathStr += `Q ${fmt(ctrl.v[0])} ${fmt(ctrl.v[1])} ${fmt(ctrl.out[0])} ${fmt(ctrl.out[1])} `;
      } else {
        emitPoint(node.x, node.y);
      }
    } else {
      if (isNextCrossArc) {
        emitPoint(node.x, node.y);
        lastCross = node;
        isNextCrossArc = false;
      } else {
        if (lastCross) {
          pathStr += arcSegment(lastCross.x, lastCross.y, node.x, node.y);
        }
        isNextCrossArc = true;
      }
    }
  }

  return pathStr + "Z";
}
