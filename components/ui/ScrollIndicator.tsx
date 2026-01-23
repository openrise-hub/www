'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrollIndicatorProps {
  className?: string;
}

export default function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // User has scrolled - start 100ms delay before fading
        if (!isFading && isVisible) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsFading(true);
            // After 300ms fade, hide completely
            setTimeout(() => {
              setIsVisible(false);
            }, 300);
          }, 100);
        }
      } else {
        // User scrolled back to top - reset
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsFading(false);
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, isFading]);

  if (!isVisible) return null;

  const handleClick = () => {
    const goalSection = document.getElementById('thegoal');
    if (goalSection) {
      goalSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex flex-col items-center gap-2 
        transition-opacity duration-300 ease-out
        cursor-pointer hover:opacity-100
        ${isFading ? 'opacity-0' : 'opacity-80'}
        ${className || ''}
      `}
    >
      <span className="text-xs uppercase tracking-[0.2em] text-foreground animate-bounce">
        Scroll down
      </span>
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="text-foreground animate-bounce"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
  );
}

