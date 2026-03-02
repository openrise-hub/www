'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
}

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    fetch('https://api.github.com/orgs/openrise-hub/repos')
      .then(res => res.json())
      .then(data => {
        const filteredRepos = Array.isArray(data) 
          ? data.filter((repo: Repository) => repo.name !== 'www') 
          : [];
        setRepos(filteredRepos);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching repos:', err);
        setLoading(false);
      });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="repositories" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-base uppercase tracking-[0.25em] text-slate mb-12 font-semibold font-heading">
          Our Projects
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-slate animate-pulse">Loading repositories...</p>
          </div>
        ) : (
          <div className="relative">
            {/* The Container */}
            <div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "relative w-full aspect-video md:aspect-[21/9] bg-[#1a1a19] select-none",
                "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]",
                "transition-all duration-500",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              {/* Draggable Area */}
              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={cn(
                  "flex items-stretch h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth",
                  isDragging && "scroll-auto"
                )}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {repos.map((repo) => (
                  <div 
                    key={repo.id}
                    className="flex-shrink-0 w-full h-full snap-center relative group"
                  >
                    <ProjectSlide repo={repo} isHovered={isHovered} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectSlide({ repo, isHovered }: { repo: Repository, isHovered: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const q = gsap.utils.selector(overlayRef.current);
    
    if (isHovered) {
      gsap.to(q(".negative-text"), { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        overwrite: true 
      });
    } else {
      gsap.to(q(".negative-text"), { 
        opacity: 0, 
        y: 20, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: "power2.in",
        overwrite: true 
      });
    }
  }, [isHovered]);

  return (
    <div className="w-full h-full relative">
      {/* Multimedia */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full flex items-center justify-center p-24 bg-slate/[0.02]">
          <Image 
            src="/infinite.svg" 
            alt={repo.name} 
            fill
            className="object-contain opacity-30 filter grayscale group-hover:opacity-100 transition-all duration-700"
            draggable={false}
          />
        </div>
      </div>

      {/* Negative Text Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="max-w-4xl text-center px-8 text-white">
          <h3 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter negative-text">
            {repo.name}
          </h3>

          <p className="text-lg leading-relaxed mb-12 max-w-2xl mx-auto negative-text font-medium">
            {repo.description || 'Contributing high-performance tools and interactive experiences to the open-source community.'}
          </p>

          <a 
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-target inline-flex items-center gap-6 text-xs font-bold uppercase tracking-[0.5em] hover:opacity-70 transition-opacity pointer-events-auto negative-text"
            onMouseDown={(e) => e.stopPropagation()} 
          >
            <span className="relative">
              Explore Project
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white" />
            </span>
            <span className="text-3xl">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
