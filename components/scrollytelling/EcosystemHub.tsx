'use client';

import { GithubIcon, LinkedinIcon, MailIcon, ArrowRightIcon } from '@/components/ui';
import { siteConfig } from '@/lib';

interface HubItem {
  id: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
}

const HUB_ITEMS: HubItem[] = [
  {
    id: 'github',
    title: 'GitHub Organization',
    desc: 'Explore source code, active repositories, and contribute directly.',
    href: siteConfig.links.github,
    icon: GithubIcon,
    isExternal: true,
  },
  {
    id: 'discussions',
    title: 'GitHub Discussions',
    desc: 'Share RFCs, feature ideas, and connect with our maintainer team.',
    href: `${siteConfig.links.github}/discussions`,
    icon: GithubIcon,
    isExternal: true,
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Network',
    desc: 'Follow organization milestones, team announcements, and events.',
    href: siteConfig.links.linkedin,
    icon: LinkedinIcon,
    isExternal: true,
  },
  {
    id: 'blog',
    title: 'Openrise Blog',
    desc: 'Read technical engineering guides and deep-dives on Hashnode.',
    href: 'https://openrise.hashnode.dev/',
    icon: ArrowRightIcon,
    isExternal: true,
  },
  {
    id: 'contact',
    title: 'Direct Contact',
    desc: 'Collaborate with us or ask questions directly via email.',
    href: 'mailto:team@openrise.tech',
    icon: MailIcon,
    isExternal: false,
  },
];

export default function EcosystemHub({ isActive = false }: { isActive?: boolean }) {
  return (
    <div className="sing-hub-diagram">
      {HUB_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            className={`sing-hubbox group ${isActive ? 'cursor-target' : 'pointer-events-none'}`}
          >
            <div className="sing-hubbox-head">
              <span className="sing-hubbox-title">{item.title}</span>
              <span className="sing-hubbox-go">
                <IconComponent className="w-4 h-4 text-lemon transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
            <p className="sing-hubbox-desc">{item.desc}</p>
          </a>
        );
      })}
    </div>
  );
}
