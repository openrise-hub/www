'use client';

interface AnimatedMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function AnimatedMenuToggle({ isOpen, onClick, className = "" }: AnimatedMenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-8 h-8 flex flex-col justify-center items-center group ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative w-6 h-5 flex flex-col justify-between">
        {/* Top bar */}
        <span
          className={`
            w-full h-0.5 bg-slate group-hover:bg-foreground transition-all duration-300 ease-in-out origin-left
            ${isOpen ? "rotate-45 translate-x-1 -translate-y-px" : "rotate-0 translate-x-0 translate-y-0"}
          `}
        />
        {/* Middle bar */}
        <span
          className={`
            w-full h-0.5 bg-slate group-hover:bg-foreground transition-all duration-300 ease-in-out
            ${isOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}
          `}
        />
        {/* Bottom bar */}
        <span
          className={`
            w-full h-0.5 bg-slate group-hover:bg-foreground transition-all duration-300 ease-in-out origin-left
            ${isOpen ? "-rotate-45 translate-x-1 translate-y-px" : "rotate-0 translate-x-0 translate-y-0"}
          `}
        />
      </div>
    </button>
  );
}
