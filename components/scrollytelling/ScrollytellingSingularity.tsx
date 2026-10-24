'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { View, PerspectiveCamera } from '@react-three/drei';
import LogoBlackHole, { ScrollData } from './LogoBlackHole';
import Hero3DHeadline from './Hero3DHeadline';
import WordboxPillars from './WordboxPillars';
import ProjectConstellation from './ProjectConstellation';
import EcosystemHub from './EcosystemHub';
import { GithubIcon, LinkedinIcon, ArrowRightIcon } from '@/components/ui';
import { siteConfig } from '@/lib';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGES = [
  { id: 'start', label: '01 CORE', hudLabel: 'EMPOWER BUILDERS' },
  { id: 'pillars', label: '02 PILLARS', hudLabel: 'THREE PILLARS' },
  { id: 'core', label: '03 MISSION', hudLabel: 'UNIFIED MISSION' },
  { id: 'constellation', label: '04 PROJECTS', hudLabel: 'PROJECTS' },
  { id: 'community', label: '05 COMMUNITY', hudLabel: 'COMMUNITY & COLLAB' },
  { id: 'explore', label: '06 EXPLORE', hudLabel: 'ECOSYSTEM HUB' },
];

export default function ScrollytellingSingularity() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const scrollDataRef = useRef<ScrollData>({
    progress: 0,
    activeStage: 0,
    heroDissolve: 0,
    finaleDive: 0,
  });

  const hudStageRef = useRef<HTMLSpanElement>(null);
  const hudProgressRef = useRef<HTMLSpanElement>(null);
  const hudBarRef = useRef<HTMLDivElement>(null);

  const scrollToStage = (stageIdx: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + (stageIdx / STAGES.length) * totalHeight;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, { duration: 1.4 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      const idx = STAGES.findIndex(
        (s) => s.id === hash || (hash === 'repositories' && s.id === 'constellation') || (hash === 'projects' && s.id === 'constellation')
      );
      if (idx !== -1) {
        scrollToStage(idx);
      }
    };
    window.addEventListener('hashchange', handleHash);
    if (window.location.hash) {
      setTimeout(handleHash, 300);
    }

    const ctx = gsap.context(() => {
      const totalStages = STAGES.length;

      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          const stageIndex = Math.min(
            totalStages - 1,
            Math.floor(p * totalStages)
          );

          scrollDataRef.current.progress = p;
          scrollDataRef.current.activeStage = stageIndex;

          const heroRange = 1 / totalStages;
          const hp = Math.min(1, Math.max(0, p / heroRange));
          scrollDataRef.current.heroDissolve = hp;

          const finaleStart = 0.82;
          if (p >= finaleStart) {
            const dp = (p - finaleStart) / (1 - finaleStart);
            scrollDataRef.current.finaleDive = Math.min(1, Math.max(0, dp));
          } else {
            scrollDataRef.current.finaleDive = 0;
          }

          if (hudProgressRef.current) {
            hudProgressRef.current.textContent = p.toFixed(3);
          }
          if (hudBarRef.current) {
            hudBarRef.current.style.setProperty('--sing-p', String(p));
          }

          if (stageIndex !== activeStageRef.current) {
            activeStageRef.current = stageIndex;
            setActiveStage(stageIndex);
            if (hudStageRef.current) {
              hudStageRef.current.textContent = `${String(stageIndex + 1).padStart(2, '0')} ${STAGES[stageIndex]?.hudLabel}`;
            }
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sing-root relative w-full"
      style={{ height: `${(STAGES.length + 1) * 100}vh` }}
    >
      <div className="sing-sticky-frame">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <View className="w-full h-full">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={35} />
            <LogoBlackHole scrollDataRef={scrollDataRef} />
            <Hero3DHeadline scrollDataRef={scrollDataRef} />
          </View>
        </div>

        <div className="sing-vignette" />
        <div className="sing-scanlines" />

        <div className="sing-hud" aria-hidden="true">
          <div className="sing-hud-row">
            <span className="sing-hud-key">STAGE</span>
            <span ref={hudStageRef} className="sing-hud-val">
              01 {STAGES[0]?.hudLabel}
            </span>
          </div>
          <div className="sing-hud-row">
            <span className="sing-hud-key">PROGRESS</span>
            <span ref={hudProgressRef} className="sing-hud-val">
              0.000
            </span>
          </div>
          <div
            ref={hudBarRef}
            className="sing-hud-bar"
            style={{ '--sing-p': 0 } as React.CSSProperties}
          />
        </div>

        <nav className="h2-side" aria-label="Sections">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`h2-side-item ${activeStage === idx ? 'is-active' : ''}`}
              onClick={() => scrollToStage(idx)}
            >
              <span className="h2-side-tick" />
              <span className="h2-side-label">{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="sing-beats">
          <div
            className={`sing-beat sing-beat--hero ${
              activeStage === 0 ? 'is-active' : ''
            }`}
          >
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
              <span className="sing-kicker relative z-10 !mb-0">Open Source Collective</span>

              <h1 className="sr-only">
                Build Useful Tools. Empower Open Source.
              </h1>

              <div
                id="hero-3d-slot"
                className="relative w-full max-w-3xl flex items-center justify-center pointer-events-none select-none"
                style={{
                  height: 'clamp(140px, 20vw, 190px)',
                  marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
                  marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)',
                }}
              />

              <p className="sing-sub relative z-10 text-center mx-auto max-w-2xl text-[#fcf7f8] !font-bold text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] !mt-0">
                {siteConfig.description}
              </p>
              <div className="sing-cta-row relative z-10 mt-6 sm:mt-7">
                <button
                  type="button"
                  onClick={() => scrollToStage(3)}
                  className="sing-cta sing-cta--primary cursor-target"
                >
                  Explore Projects
                </button>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sing-cta sing-cta--ghost cursor-target"
                >
                  Join Community
                </a>
              </div>
            </div>
          </div>

          <div
            className={`sing-beat ${
              activeStage === 1 ? 'is-active' : ''
            }`}
          >
            <div className="sing-section-header">
              <span className="sing-kicker">Foundational Principles</span>
              <h2 className="sing-h text-2xl md:text-3xl">Three Pillars of Openrise</h2>
            </div>
            <WordboxPillars isActive={activeStage === 1} />
            <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-center pointer-events-none z-20">
              <p className="text-xs sm:text-sm font-mono tracking-wider text-slate uppercase">
                No gatekeeping. Pure collaboration. Built in the open.
              </p>
            </div>
          </div>

          <div
            className={`sing-beat sing-beat--split-left ${
              activeStage === 2 ? 'is-active' : ''
            }`}
          >
            <div className="sing-col">
              <span className="sing-kicker">Expanding the Horizon</span>
              <h2 className="sing-h mb-6">
                Beyond code, we build builders.
              </h2>
              <p className="sing-sub">
                Our mission is dual-fold: to build reliable, high-performance tools that eliminate
                friction and empower people worldwide, while creating an apprenticeship
                culture where junior engineers master production workflows, code reviews, and true collaboration.
              </p>
              <div className="sing-cta-row">
                <a
                  href={`${siteConfig.links.github}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sing-cta sing-cta--primary cursor-target"
                >
                  Join the Mission →
                </a>
              </div>
            </div>
          </div>

          <div
            className={`sing-beat ${
              activeStage === 3 ? 'is-active' : ''
            }`}
          >
            <div className="sing-section-header">
              <span className="sing-kicker">Organization Repositories</span>
              <h2 className="sing-h text-2xl md:text-3xl">Featured Projects</h2>
            </div>
            <ProjectConstellation isActive={activeStage === 3} />
          </div>

          <div
            id="community"
            className={`sing-beat sing-beat--split-right ${
              activeStage === 4 ? 'is-active' : ''
            }`}
          >
            <div className="sing-col ml-auto">
              <span className="sing-kicker">Community & Collaboration</span>
              <h2 className="sing-h mb-4">
                Built by developers,{' '}
                <span className="g">for everyone.</span>
              </h2>
              <p className="sing-sub mb-8">
                Join our growing collective of maintainers and contributors. Whether you want to solve a real tooling problem, submit your first pull request, or review RFCs, you are welcome here.
              </p>

              <div className="sing-cta-row">
                <a
                  href={`${siteConfig.links.github}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sing-cta sing-cta--primary cursor-target"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Discussions</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sing-cta sing-cta--ghost cursor-target"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn Updates</span>
                </a>
              </div>
            </div>
          </div>

          <div
            className={`sing-beat flex-col justify-center text-center ${
              activeStage === 5 ? 'is-active' : ''
            }`}
          >
            <span className="sing-kicker mx-auto">The Ecosystem Hub</span>
            <h2 className="sing-h mb-2">Connect Across All Channels</h2>
            <p className="sing-sub mx-auto max-w-xl text-center mb-6">
              Community portals, technical articles, and direct maintainer lines.
            </p>
            <EcosystemHub isActive={activeStage === 5} />
          </div>
        </div>
      </div>
    </div>
  );
}
