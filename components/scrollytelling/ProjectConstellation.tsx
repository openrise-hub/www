'use client';

import { useEffect, useState, useRef } from 'react';
import { GithubIcon, ArrowRightIcon } from '@/components/ui';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

export default function ProjectConstellation({ isActive = false }: { isActive?: boolean }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardPositions, setCardPositions] = useState<{ x: number; y: number; side: 'left' | 'right' }[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/orgs/openrise-hub/repos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter((r: Repository) => r.name !== 'www')
            .slice(0, 4);
          setRepos(filtered);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch repositories for constellation:', err);
      });
  }, []);

  useEffect(() => {
    const updateTendrils = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const positions = [
        { x: rect.width * 0.28, y: rect.height * 0.35, side: 'left' as const },
        { x: rect.width * 0.28, y: rect.height * 0.65, side: 'left' as const },
        { x: rect.width * 0.72, y: rect.height * 0.35, side: 'right' as const },
        { x: rect.width * 0.72, y: rect.height * 0.65, side: 'right' as const },
      ];
      setCardPositions(positions);
    };

    updateTendrils();
    window.addEventListener('resize', updateTendrils);
    return () => window.removeEventListener('resize', updateTendrils);
  }, [repos]);

  const leftRepos = repos.slice(0, 2);
  const rightRepos = repos.slice(2, 4);

  return (
    <div ref={containerRef} className="sing-const relative w-full h-full">
      <svg className="sing-const-svg" aria-hidden="true">
        <defs>
          <linearGradient id="lemon-tendril-grad" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f9e900" stopOpacity="0.2" />
            <stop offset="0.4" stopColor="#f9e900" stopOpacity="0.85" />
            <stop offset="0.75" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#f9e900" stopOpacity="0" />
          </linearGradient>
        </defs>

        {cardPositions.map((pos, idx) => {
          if (idx >= repos.length) return null;
          const centerX = containerRef.current ? containerRef.current.clientWidth / 2 : 500;
          const centerY = containerRef.current ? containerRef.current.clientHeight / 2 : 400;
          const startX = pos.side === 'left' ? pos.x + 120 : pos.x - 120;
          const startY = pos.y;

          const controlX1 = startX + (centerX - startX) * 0.5;
          const controlY1 = startY;
          const controlX2 = startX + (centerX - startX) * 0.8;
          const controlY2 = centerY;

          const d = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${centerX} ${centerY}`;

          return (
            <g key={idx}>
              <path d={d} className="sing-edge" stroke="url(#lemon-tendril-grad)" />
              <path d={d} className="sing-flow" stroke="url(#lemon-tendril-grad)" style={{ animationDelay: `${-0.5 * idx}s` }} />
              <path d={d} className="sing-pulse" stroke="url(#lemon-tendril-grad)" style={{ animationDelay: `${-0.7 * idx}s` }} />
            </g>
          );
        })}
      </svg>

      <div className="sing-cards sing-cards--l">
        {leftRepos.map((repo, idx) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
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
