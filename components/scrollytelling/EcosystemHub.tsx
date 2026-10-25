'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { GithubIcon, LinkedinIcon, MailIcon, ArrowRightIcon } from '@/components/ui';
import { siteConfig } from '@/lib';

interface HubCardData {
  id: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const LEFT_CARDS: HubCardData[] = [
  {
    id: 'github',
    title: 'GitHub Organization',
    desc: 'Explore active repositories, submit pull requests, and audit tool code.',
    cta: 'Explore',
    href: siteConfig.links.github,
    icon: GithubIcon,
    isExternal: true,
  },
  {
    id: 'discussions',
    title: 'GitHub Discussions',
    desc: 'Participate in architectural RFCs, feature proposals, and team Q&A.',
    cta: 'Discuss',
    href: `${siteConfig.links.github}/discussions`,
    icon: GithubIcon,
    isExternal: true,
  },
];

const RIGHT_CARDS: HubCardData[] = [
  {
    id: 'blog',
    title: 'Openrise Blog',
    desc: 'Deep dives on tool performance, architecture, and engineering writeups.',
    cta: 'Read',
    href: 'https://openrise.hashnode.dev/',
    icon: ArrowRightIcon,
    isExternal: true,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Network',
    desc: 'Follow organization milestones, team growth, and release announcements.',
    cta: 'Follow',
    href: siteConfig.links.linkedin,
    icon: LinkedinIcon,
    isExternal: true,
  },
];

const BOTTOM_CARD: HubCardData = {
  id: 'contact',
  title: 'Maintainer Line',
  desc: 'Direct communication channel with core leads for collaborations.',
  cta: 'Contact',
  href: 'mailto:team@openrise.tech',
  icon: MailIcon,
  isExternal: false,
};

export default function EcosystemHub({ isActive = false }: { isActive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const rightCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const bottomCardRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const leftEls = leftCardsRef.current.filter(Boolean) as HTMLAnchorElement[];
    const rightEls = rightCardsRef.current.filter(Boolean) as HTMLAnchorElement[];
    const bottomEl = bottomCardRef.current;
    const allEls = [...leftEls, ...rightEls, ...(bottomEl ? [bottomEl] : [])];

    if (!isActive) {
      gsap.to(allEls, {
        opacity: 0,
        scale: 0.94,
        duration: 0.35,
        ease: 'power2.in',
      });
      return;
    }

    const tl = gsap.timeline();

    tl.fromTo(
      leftEls,
      {
        x: -60,
        opacity: 0,
        scale: 0.94,
        rotateY: 14,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      },
      0
    );

    tl.fromTo(
      rightEls,
      {
        x: 60,
        opacity: 0,
        scale: 0.94,
        rotateY: -14,
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      },
      0.06
    );

    if (bottomEl) {
      tl.fromTo(
        bottomEl,
        {
          y: 40,
          opacity: 0,
          scale: 0.94,
          rotateX: -14,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          ease: 'power3.out',
        },
        0.12
      );
    }

    const floatTweens: gsap.core.Tween[] = [];
    allEls.forEach((el, idx) => {
      const dur = 3.6 + (idx % 2) * 0.6;
      const yDist = idx % 2 === 0 ? 5 : -5;
      const tween = gsap.to(el, {
        y: `+=${yDist}`,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.7 + idx * 0.1,
      });
      floatTweens.push(tween);
    });

    return () => {
      tl.kill();
      floatTweens.forEach((t) => t.kill());
    };
  }, [isActive]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    gsap.to(card, {
      rotateY: normX * 12,
      rotateX: -normY * 12,
      z: 14,
      scale: 1.03,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      z: 0,
      scale: 1,
      duration: 0.65,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <div ref={containerRef} className="sing-hub-wings absolute inset-0 pointer-events-none z-10">
      <div
        className="sing-hub-wing sing-hub-wing--l"
        style={{
          left: 'clamp(4.5rem, 13.5vw, 16rem)',
          width: 'clamp(230px, 17.5vw, 275px)',
        }}
      >
        {LEFT_CARDS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              ref={(el) => {
                leftCardsRef.current[idx] = el;
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className={`sing-hub-card ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
            >
              <div className="sing-hub-card-head">
                <span className="text-lemon">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="sing-hub-card-title">{item.title}</span>
              </div>
              <p className="sing-hub-card-desc">{item.desc}</p>
              <div className="sing-hub-card-cta">
                <span>{item.cta}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>

      <div
        className="sing-hub-wing sing-hub-wing--r"
        style={{
          right: 'clamp(5.5rem, 14.5vw, 17rem)',
          width: 'clamp(230px, 17.5vw, 275px)',
        }}
      >
        {RIGHT_CARDS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              ref={(el) => {
                rightCardsRef.current[idx] = el;
              }}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className={`sing-hub-card ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
            >
              <div className="sing-hub-card-head">
                <span className="text-lemon">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="sing-hub-card-title">{item.title}</span>
              </div>
              <p className="sing-hub-card-desc">{item.desc}</p>
              <div className="sing-hub-card-cta">
                <span>{item.cta}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>

      <div
        className="sing-hub-bottom"
        style={{
          position: 'absolute',
          bottom: 'clamp(1.25rem, 3.2vh, 2.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(230px, 17.5vw, 275px)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <a
          href={BOTTOM_CARD.href}
          target={BOTTOM_CARD.isExternal ? '_blank' : undefined}
          rel={BOTTOM_CARD.isExternal ? 'noopener noreferrer' : undefined}
          ref={bottomCardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className={`sing-hub-card ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
        >
          <div className="sing-hub-card-head">
            <span className="text-lemon">
              <MailIcon className="w-4 h-4" />
            </span>
            <span className="sing-hub-card-title">{BOTTOM_CARD.title}</span>
          </div>
          <p className="sing-hub-card-desc">{BOTTOM_CARD.desc}</p>
          <div className="sing-hub-card-cta">
            <span>{BOTTOM_CARD.cta}</span>
            <ArrowRightIcon className="w-3.5 h-3.5 transition-transform" />
          </div>
        </a>
      </div>
    </div>
  );
}
