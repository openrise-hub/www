'use client';

import { useEffect, useRef, useState } from 'react';
import { createWordboxPath } from './wordboxPath';

interface Pillar {
  id: number;
  word: string;
  desc: string;
  posClass: string;
}

const PILLARS: Pillar[] = [
  {
    id: 1,
    word: 'Build.',
    desc: 'Crafting useful software tools designed to solve real problems for everyone in the open-source ecosystem.',
    posClass: 'sing-wordbox--p1',
  },
  {
    id: 2,
    word: 'Mentor.',
    desc: 'Providing a supportive space for junior developers to master Git workflows, RFCs, and true collaboration.',
    posClass: 'sing-wordbox--p2',
  },
  {
    id: 3,
    word: 'Scale.',
    desc: "Shipping code that stays fast and doesn't break.",
    posClass: 'sing-wordbox--p3',
  },
];

export default function WordboxPillars({ isActive = false }: { isActive?: boolean }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [svgPaths, setSvgPaths] = useState<string[]>(['', '', '']);

  useEffect(() => {
    const updatePaths = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const R = Math.min(window.innerWidth, window.innerHeight) * 0.28;

      const newPaths = cardRefs.current.map((el) => {
        if (!el) return '';
        const rect = el.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const cx = centerX - rect.left;
        const cy = centerY - rect.top;
        return createWordboxPath(w, h, cx, cy, R, 0);
      });

      setSvgPaths(newPaths);
    };

    updatePaths();
    window.addEventListener('resize', updatePaths);
    return () => window.removeEventListener('resize', updatePaths);
  }, []);

  return (
    <div className="sing-pillars-container">
      {PILLARS.map((pillar, idx) => (
        <div
          key={pillar.id}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className={`sing-wordbox ${pillar.posClass} ${isActive ? '' : 'pointer-events-none'}`}
        >
          {svgPaths[idx] && (
            <svg className="sing-wordbox-frame" aria-hidden="true">
              <path d={svgPaths[idx]} />
            </svg>
          )}

          <div className="relative z-10 flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between w-full">
              <span className="sing-wordbox-t">
                <span className="sing-wordbox-num">{pillar.id}.</span>
                {pillar.word}
              </span>
            </div>
            <p className="sing-wordbox-desc">{pillar.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
