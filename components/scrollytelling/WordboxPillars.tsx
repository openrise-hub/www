'use client';

import { useEffect, useRef, useState } from 'react';
import { computeCardSlice } from './wordboxPath';
import { subscribeRingSync, RingSyncData } from './ringSync';

interface Pillar {
  id: number;
  word: string;
  desc: string;
  posClass: string;
  alignClass: string;
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    word: 'Build.',
    desc: 'Crafting useful software tools designed to solve real problems for everyone in the open-source ecosystem.',
    posClass: 'sing-wordbox--p1',
    alignClass: 'items-start text-left',
  },
  {
    id: 2,
    word: 'Mentor.',
    desc: 'Providing a supportive space for junior developers to master Git workflows, RFCs, and true collaboration.',
    posClass: 'sing-wordbox--p2',
    alignClass: 'items-end text-right',
  },
  {
    id: 3,
    word: 'Scale.',
    desc: "Shipping code that stays fast and doesn't break.",
    posClass: 'sing-wordbox--p3',
    alignClass: 'items-center text-center',
  },
];

export default function WordboxPillars({ isActive = false }: { isActive?: boolean }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardDims, setCardDims] = useState<{ w: number; h: number }[]>([
    { w: 270, h: 145 },
    { w: 270, h: 145 },
    { w: 270, h: 145 },
  ]);

  useEffect(() => {
    const updateDims = () => {
      const dims = cardRefs.current.map((el) => {
        if (!el) return { w: 270, h: 145 };
        const rect = el.getBoundingClientRect();
        return { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
      });
      setCardDims(dims);
    };

    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  useEffect(() => {
    const applySync = (data: RingSyncData) => {
      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        if (w <= 1 || h <= 1) return;

        const cx = data.cx - rect.left;
        const cy = data.cy - rect.top;
        const R = idx === 2 ? data.rInner : data.rMiddle;

        const { pathA, pathB, sliceLine } = computeCardSlice(w, h, cx, cy, R, 14);

        const pathAEl = el.querySelector<SVGPathElement>('.sing-wordbox-bg-a');
        const pathBEl = el.querySelector<SVGPathElement>('.sing-wordbox-bg-b');
        const sliceEl = el.querySelector<SVGPathElement>('.sing-wordbox-slice-line');

        if (pathAEl) pathAEl.setAttribute('d', pathA);
        if (pathBEl) pathBEl.setAttribute('d', pathB);
        if (sliceEl) sliceEl.setAttribute('d', sliceLine);
      });
    };

    const unsubscribe = subscribeRingSync(applySync);
    return () => unsubscribe();
  }, [isActive]);

  return (
    <div className="sing-pillars-container">
      {PILLARS.map((pillar, idx) => (
        <div
          key={pillar.id}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className={`sing-wordbox ${pillar.posClass} ${isActive ? '' : 'pointer-events-none'}`}
        >
          <svg
            className="sing-wordbox-frame"
            viewBox={`0 0 ${cardDims[idx]?.w || 270} ${cardDims[idx]?.h || 145}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="sing-wordbox-bg-b" d="" />
            <path className="sing-wordbox-bg-a" d="" />
            <path className="sing-wordbox-slice-line" d="" />
          </svg>

          <div className={`relative z-10 flex flex-col gap-1 w-full ${pillar.alignClass}`}>
            <span className="sing-wordbox-t">
              <span className="sing-wordbox-num">{pillar.id}.</span>
              {pillar.word}
            </span>
            <p className="sing-wordbox-desc">{pillar.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
