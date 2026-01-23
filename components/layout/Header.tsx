'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "The Goal", href: "#thegoal" },
  { label: "Our Projects", href: "#repositories" },
  { label: "Community", href: "#community" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full flex justify-center pt-2 pointer-events-none">
      <div className={`
        w-full max-w-6xl flex items-center justify-between px-6 py-4 pointer-events-auto
        transition-all duration-500 ease-in-out
        ${isScrolled
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
            <Link
              key={link.label}
              href={link.href}
              className="text-lg text-slate hover:text-foreground hover:bg-white/10 px-3 py-1.5 transition-all duration-200 cursor-target"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
