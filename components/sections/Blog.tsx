'use client';

import { ArrowRightIcon } from "@/components/ui";

export default function Blog() {
  return (
    <section id="blog" className="py-28 px-6 relative z-10 border-t border-[rgba(249,233,0,0.12)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-lemon" />
          <h2 className="text-xs uppercase tracking-[0.28em] text-lemon font-mono font-semibold">
            Openrise Technical Blog
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 font-sans">
              Engineering insights, architectural RFCs, and lessons learned.
            </h3>
            <p className="text-lg leading-relaxed text-[#a2aba5] mb-8">
              We publish deep dives into open-source architecture, tool performance, TypeScript/Rust patterns, and the mechanics of building collaborative software in public.
            </p>

            <a
              href="https://openrise.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="sing-cta sing-cta--primary cursor-target inline-flex"
            >
              <span>Explore Hashnode Blog</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="lg:col-span-4">
            <a
              href="https://openrise.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-none bg-[rgba(36,36,35,0.7)] backdrop-blur-md border border-[rgba(249,233,0,0.18)] hover:border-lemon transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[0.68rem] font-mono tracking-widest uppercase text-lemon px-2.5 py-1 rounded-none bg-lemon/10 border border-lemon/20">
                  HASHNODE PUBLICATION
                </span>
                <ArrowRightIcon className="w-4 h-4 text-lemon transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-lemon transition-colors">
                openrise.hashnode.dev
              </h4>
              <p className="text-sm text-[#a2aba5] leading-relaxed">
                Read our latest articles on open-source development, developer tooling, and community engineering.
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
