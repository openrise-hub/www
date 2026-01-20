import Link from "next/link";
import { GithubIcon } from "@/components/ui/icons";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/95 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex items-center justify-between">
        <Link 
          href="/"
          className="text-xl font-bold tracking-tight text-foreground font-heading"
        >
          OPENRISE
        </Link>
        
        <a
          href="https://github.com/openrise"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-lemon transition-colors duration-200"
          aria-label="GitHub"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </nav>
    </header>
  );
}
