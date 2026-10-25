'use client';

import { useEffect, useState, useRef } from 'react';
import { GithubIcon, ArrowRightIcon } from '@/components/ui';
import { subscribeRingSync, RingSyncData } from './ringSync';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

const FALLBACK_REPOS: Repository[] = [
  {
    id: 1,
    name: 'forge',
    description: 'High-performance extensible CLI framework and developer toolkit in Rust.',
    html_url: 'https://github.com/openrise-hub',
    language: 'Rust',
    stargazers_count: 142,
  },
  {
    id: 2,
    name: 'sentinel',
    description: 'Automated dependency health, vulnerability, and license compliance auditing engine.',
    html_url: 'https://github.com/openrise-hub',
    language: 'TypeScript',
    stargazers_count: 98,
  },
  {
    id: 3,
    name: 'orbit',
    description: 'Distributed peer telemetry mesh and real-time coordination RPC protocol.',
    html_url: 'https://github.com/openrise-hub',
    language: 'Go',
    stargazers_count: 87,
  },
  {
    id: 4,
    name: 'core',
    description: 'Central monorepo containing design tokens, base utilities, and shared protocols.',
    html_url: 'https://github.com/openrise-hub',
    language: 'TypeScript',
    stargazers_count: 215,
  },
];

const ROW_ANGLES = {
  left: [158 * (Math.PI / 180), 202 * (Math.PI / 180)],
  right: [22 * (Math.PI / 180), 338 * (Math.PI / 180)],
};

export default function ProjectConstellation({ isActive = false }: { isActive?: boolean }) {
  const [repos, setRepos] = useState<Repository[]>(FALLBACK_REPOS);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightCardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const beamRefs = useRef<(SVGPathElement | null)[]>([]);
  const edgeRefs = useRef<(SVGPathElement | null)[]>([]);
  const flowRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGPathElement | null)[]>([]);
  const gradRefs = useRef<(SVGLinearGradientElement | null)[]>([]);
  const tipRefs = useRef<(HTMLElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/orgs/openrise-hub/repos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const filtered = data
            .filter((r: Repository) => r.name !== 'www')
            .sort((a: Repository, b: Repository) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
            .slice(0, 4);
          if (filtered.length >= 2) {
            setRepos(filtered);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const updateTendrils = (cx: number, cy: number, _r: number) => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      const w = cRect.width || window.innerWidth;
      const h = cRect.height || window.innerHeight;

      const ringX = (cx > 0 ? cx : w / 2) - (cRect.left || 0);
      const ringY = (cy > 0 ? cy : h / 2) - (cRect.top || 0);
      const logoR = Math.max(95, Math.min(Math.min(w, h) * 0.175, 145));

      for (let i = 0; i < 4; i++) {
        const isLeft = i < 2;
        const row = i % 2;
        const cardEl = isLeft ? leftCardRefs.current[row] : rightCardRefs.current[row];

        let e = isLeft ? w * 0.28 : w * 0.72;
        let t = row === 0 ? h * 0.35 : h * 0.65;

        if (cardEl) {
          const cardRect = cardEl.getBoundingClientRect();
          if (cardRect.width > 10) {
            e = isLeft ? cardRect.right - (cRect.left || 0) : cardRect.left - (cRect.left || 0);
            t = cardRect.top + cardRect.height / 2 - (cRect.top || 0);
          }
        }

        const angle = isLeft ? ROW_ANGLES.left[row] : ROW_ANGLES.right[row];
        const n = ringX + logoR * Math.cos(angle);
        const o = ringY - logoR * Math.sin(angle);

        const c = e + (n - e) * 0.45;
        const d = e + (n - e) * 0.85;

        const fill = `M ${e.toFixed(1)} ${(t - 6).toFixed(1)} C ${c.toFixed(1)} ${(t - 3).toFixed(1)}, ${d.toFixed(1)} ${(o - 2).toFixed(1)}, ${n.toFixed(1)} ${(o - 2).toFixed(1)} L ${n.toFixed(1)} ${(o + 2).toFixed(1)} C ${d.toFixed(1)} ${(o + 2).toFixed(1)}, ${c.toFixed(1)} ${(t + 3).toFixed(1)}, ${e.toFixed(1)} ${(t + 6).toFixed(1)} Z`;
        const center = `M ${e.toFixed(1)} ${t.toFixed(1)} C ${c.toFixed(1)} ${t.toFixed(1)}, ${d.toFixed(1)} ${o.toFixed(1)}, ${n.toFixed(1)} ${o.toFixed(1)}`;

        beamRefs.current[i]?.setAttribute('d', fill);
        edgeRefs.current[i]?.setAttribute('d', center);
        flowRefs.current[i]?.setAttribute('d', center);
        pulseRefs.current[i]?.setAttribute('d', center);

        const grad = gradRefs.current[i];
        if (grad) {
          grad.setAttribute('x1', String(e.toFixed(1)));
          grad.setAttribute('y1', String(t.toFixed(1)));
          grad.setAttribute('x2', String(n.toFixed(1)));
          grad.setAttribute('y2', String(o.toFixed(1)));
        }

        const tip = tipRefs.current[i];
        if (tip) {
          tip.style.left = `${e}px`;
          tip.style.top = `${t}px`;
        }

        const node = nodeRefs.current[i];
        if (node) {
          node.style.left = `${n}px`;
          node.style.top = `${o}px`;
        }
      }
    };

    updateTendrils(window.innerWidth / 2, window.innerHeight / 2, window.innerHeight * 0.36);

    const handleRing = (data: RingSyncData) => {
      updateTendrils(data.cx, data.cy, data.rOuter);
    };

    const unsubscribe = subscribeRingSync(handleRing);
    return () => unsubscribe();
  }, [repos]);

  const leftRepos = repos.slice(0, 2);
  const rightRepos = repos.slice(2, 4);

  return (
    <div ref={containerRef} className={`sing-const absolute inset-0 w-full h-full pointer-events-none ${isActive ? 'is-live' : ''}`}>
      <svg className="sing-const-svg" aria-hidden="true">
        <defs>
          {[0, 1, 2, 3].map((i) => (
            <linearGradient
              key={i}
              id={`const-tendril-grad-${i}`}
              gradientUnits="userSpaceOnUse"
              ref={(el) => {
                gradRefs.current[i] = el;
              }}
            >
              <stop offset="0%" stopColor="#f9e900" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#f9e900" stopOpacity="1" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#f9e900" stopOpacity="0.85" />
            </linearGradient>
          ))}
        </defs>

        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path
              className="sing-beam"
              fill={`url(#const-tendril-grad-${i})`}
              ref={(el) => {
                beamRefs.current[i] = el;
              }}
            />
            <path
              className="sing-edge"
              pathLength={1}
              stroke={`url(#const-tendril-grad-${i})`}
              ref={(el) => {
                edgeRefs.current[i] = el;
              }}
            />
            <path
              className="sing-flow"
              pathLength={1}
              stroke="#ffffff"
              style={{ animationDelay: `${-0.53 * i}s` }}
              ref={(el) => {
                flowRefs.current[i] = el;
              }}
            />
            <path
              className="sing-pulse"
              pathLength={1}
              stroke="#f9e900"
              style={{ animationDelay: `${-0.43 * i}s` }}
              ref={(el) => {
                pulseRefs.current[i] = el;
              }}
            />
          </g>
        ))}
      </svg>

      {[0, 1, 2, 3].map((i) => (
        <i
          key={`tip-${i}`}
          className="sing-tip"
          ref={(el) => {
            tipRefs.current[i] = el;
          }}
        />
      ))}

      {[0, 1, 2, 3].map((i) => (
        <i
          key={`node-${i}`}
          className="sing-node"
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
        />
      ))}

      <div className="sing-cards sing-cards--l">
        {leftRepos.map((repo, idx) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              leftCardRefs.current[idx] = el;
            }}
            className={`sing-card ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
            style={{ top: idx === 0 ? '35%' : '65%' }}
          >
            <div className="sing-card-head">
              <span className="sing-card-ico">
                <GithubIcon className="w-5 h-5" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="sing-card-name truncate">{repo.name}</span>
                {repo.language && (
                  <span className="text-[0.62rem] text-slate font-mono tracking-wider uppercase">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
            <p className="sing-card-tag">
              {repo.description || 'Open source software tool by Openrise Collective.'}
            </p>
            <div className="sing-card-cta">
              <span>★ {repo.stargazers_count} Stars</span>
              <span className="flex items-center gap-1 font-mono text-[0.65rem] text-lemon">
                VIEW CODE <ArrowRightIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="sing-cards sing-cards--r">
        {rightRepos.map((repo, idx) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              rightCardRefs.current[idx] = el;
            }}
            className={`sing-card ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
            style={{ top: idx === 0 ? '35%' : '65%' }}
          >
            <div className="sing-card-head">
              <span className="sing-card-ico">
                <GithubIcon className="w-5 h-5" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="sing-card-name truncate">{repo.name}</span>
                {repo.language && (
                  <span className="text-[0.62rem] text-slate font-mono tracking-wider uppercase">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
            <p className="sing-card-tag">
              {repo.description || 'Open source software tool by Openrise Collective.'}
            </p>
            <div className="sing-card-cta">
              <span>★ {repo.stargazers_count} Stars</span>
              <span className="flex items-center gap-1 font-mono text-[0.65rem] text-lemon">
                VIEW CODE <ArrowRightIcon className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
