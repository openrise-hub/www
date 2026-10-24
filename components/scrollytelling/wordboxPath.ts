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

export interface CardSliceResult {
  pathA: string;
  pathB: string;
  sliceLine: string;
}

export function computeCardSlice(
  w: number,
  h: number,
  cx: number,
  cy: number,
  R: number,
  cornerRad = 14
): CardSliceResult {
  const fmt = (n: number) => n.toFixed(2);
  const isInside = (x: number, y: number) => (x - cx) ** 2 + (y - cy) ** 2 < R * R;

  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];

  type CrossPoint = { x: number; y: number; edgeIdx: number };
  const allCrosses: CrossPoint[] = [];

  for (let i = 0; i < 4; i++) {
    const [x1, y1] = corners[i];
    const [x2, y2] = corners[(i + 1) % 4];
    const ts = intersectSegmentCircle(x1, y1, x2, y2, cx, cy, R);
    for (const t of ts) {
      allCrosses.push({
        x: x1 + (x2 - x1) * t,
        y: y1 + (y2 - y1) * t,
        edgeIdx: i,
      });
    }
  }

  const cr = cornerRad;
  const fullRect = `M ${fmt(cr)} 0 L ${fmt(w - cr)} 0 Q ${fmt(w)} 0 ${fmt(w)} ${fmt(cr)} L ${fmt(w)} ${fmt(h - cr)} Q ${fmt(w)} ${fmt(h)} ${fmt(w - cr)} ${fmt(h)} L ${fmt(cr)} ${fmt(h)} Q 0 ${fmt(h)} 0 ${fmt(h - cr)} L 0 ${fmt(cr)} Q 0 0 ${fmt(cr)} 0 Z`;

  if (allCrosses.length < 2) {
    const centerInside = isInside(w / 2, h / 2);
    return {
      pathA: centerInside ? '' : fullRect,
      pathB: centerInside ? fullRect : '',
      sliceLine: '',
    };
  }

  const p1 = allCrosses[0];
  const p2 = allCrosses[1];

  const crossProd = (p1.x - cx) * (p2.y - cy) - (p1.y - cy) * (p2.x - cx);
  const sweepToP2 = crossProd < 0 ? 0 : 1;
  const sliceLine = `M ${fmt(p1.x)} ${fmt(p1.y)} A ${fmt(R)} ${fmt(R)} 0 0 ${sweepToP2} ${fmt(p2.x)} ${fmt(p2.y)}`;

  const cornerControls = [
    { in: [0, cr], v: [0, 0], out: [cr, 0] },
    { in: [w - cr, 0], v: [w, 0], out: [w, cr] },
    { in: [w, h - cr], v: [w, h], out: [w - cr, h] },
    { in: [cr, h], v: [0, h], out: [0, h - cr] },
  ];

  type Node =
    | { kind: 'corner'; idx: number; x: number; y: number; in: boolean }
    | { kind: 'cross'; crossIdx: number; x: number; y: number };

  const nodes: Node[] = [];
  for (let i = 0; i < 4; i++) {
    nodes.push({
      kind: 'corner',
      idx: i,
      x: corners[i][0],
      y: corners[i][1],
      in: isInside(corners[i][0], corners[i][1]),
    });
    for (let cIdx = 0; cIdx < allCrosses.length; cIdx++) {
      if (allCrosses[cIdx].edgeIdx === i) {
        nodes.push({
          kind: 'cross',
          crossIdx: cIdx,
          x: allCrosses[cIdx].x,
          y: allCrosses[cIdx].y,
        });
      }
    }
  }

  const distToCut = (idx: number) => {
    let minD = Infinity;
    for (const cross of allCrosses) {
      minD = Math.min(minD, Math.hypot(cross.x - corners[idx][0], cross.y - corners[idx][1]));
    }
    return minD;
  };

  const buildSubpath = (targetInside: boolean) => {
    const hasTarget = nodes.some((n) => n.kind === 'corner' && n.in === targetInside);
    if (!hasTarget) return '';

    let startIdx = nodes.findIndex((n) => n.kind === 'corner' && n.in === targetInside);
    if (startIdx < 0) startIdx = 0;

    let pathStr = '';
    let penDown = false;
    let lastCrossNode: { x: number; y: number } | null = null;

    const emitPoint = (x: number, y: number) => {
      pathStr += `${penDown ? 'L' : 'M'} ${fmt(x)} ${fmt(y)} `;
      penDown = true;
    };

    for (let k = 0; k < nodes.length; k++) {
      const node = nodes[(startIdx + k) % nodes.length];
      if (node.kind === 'corner') {
        if (node.in !== targetInside) continue;
        if (distToCut(node.idx) > cr + 1) {
          const ctrl = cornerControls[node.idx];
          emitPoint(ctrl.in[0], ctrl.in[1]);
          pathStr += `Q ${fmt(ctrl.v[0])} ${fmt(ctrl.v[1])} ${fmt(ctrl.out[0])} ${fmt(ctrl.out[1])} `;
        } else {
          emitPoint(node.x, node.y);
        }
      } else {
        if (!lastCrossNode) {
          emitPoint(node.x, node.y);
          lastCrossNode = node;
        } else {
          const cp = (lastCrossNode.x - cx) * (node.y - cy) - (lastCrossNode.y - cy) * (node.x - cx);
          const sweep = cp < 0 ? 0 : 1;
          pathStr += `A ${fmt(R)} ${fmt(R)} 0 0 ${sweep} ${fmt(node.x)} ${fmt(node.y)} `;
          lastCrossNode = null;
        }
      }
    }

    return pathStr.trim() + ' Z';
  };

  const pathA = buildSubpath(false);
  const pathB = buildSubpath(true);

  return { pathA, pathB, sliceLine };
}

export function createWordboxPath(
  w: number,
  h: number,
  cx: number,
  cy: number,
  R: number,
  cornerRad = 14
): string {
  const { pathA } = computeCardSlice(w, h, cx, cy, R, cornerRad);
  return pathA;
}
