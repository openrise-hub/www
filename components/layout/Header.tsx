'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatedMenuToggle } from "../ui";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#constellation" },
  { label: "Community", href: "#community" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : 'unset';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = 'unset';
    }
    if (window.location.hash === href) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = href;
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pt-2 pointer-events-none">
        <div className={`
          w-full max-w-6xl flex items-center justify-between px-6 py-4 pointer-events-auto
          transition-all duration-500 ease-in-out
          ${isMenuOpen
            ? "bg-transparent shadow-none"
            : isScrolled
              ? "bg-background/80 backdrop-blur-md shadow-sm"
              : "bg-background/0 backdrop-blur-none shadow-none"
          }
        `}>
          <Image
            src="/OpenriseWhiteTextNoBG.svg"
            alt="Openrise"
            width={160}
            height={32}
            priority
            className="h-6 w-auto select-none pointer-events-none"
          />
          
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-lg text-slate hover:text-foreground hover:bg-white/10 px-3 py-1.5 transition-all duration-200 cursor-target"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <AnimatedMenuToggle 
              isOpen={isMenuOpen} 
              onClick={toggleMenu}
              className="cursor-target"
            />
          </div>
        </div>
      </header>

      <div className={`
        fixed inset-0 z-50 bg-background flex flex-col items-center justify-center transition-all duration-300
        ${isMenuOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none translate-y-4 invisible hidden"}
      `}>
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-4xl font-bold text-slate hover:text-lemon transition-colors cursor-target"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
