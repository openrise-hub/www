import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Repositories", href: "#repositories" },
  { label: "Community", href: "#community" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-6 py-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
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
