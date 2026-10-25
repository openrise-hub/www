'use client';

import { useState } from 'react';
import { ArrowRightIcon } from "@/components/ui";

export default function Blog() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.open(`https://openrise.hashnode.dev/newsletter?email=${encodeURIComponent(email)}`, '_blank');
    setIsSubscribed(true);
  };

  return (
    <section id="blog" className="py-28 px-6 relative z-10 border-t border-[rgba(249,233,0,0.12)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-lemon" />
          <h2 className="text-xs uppercase tracking-[0.28em] text-lemon font-mono font-semibold">
            Openrise Technical Blog
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 font-sans">
              Engineering insights, architectural RFCs, and lessons learned.
            </h3>
            <p className="text-lg leading-relaxed text-[#a2aba5] mb-8 max-w-xl">
              We publish deep dives into open-source architecture, tool performance, TypeScript/Rust patterns, and the mechanics of building collaborative software in public.
            </p>

            <a
              href="https://openrise.hashnode.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="sing-cta sing-cta--primary cursor-target inline-flex items-center"
            >
              <span>Explore Hashnode Publication</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </a>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 bg-[rgba(36,36,35,0.7)] backdrop-blur-md border border-[rgba(249,233,0,0.18)] flex flex-col justify-between">
              <div className="mb-5">
                <h4 className="text-lg font-bold text-foreground mb-2">
                  Stay in the loop with our latest posts
                </h4>
                <p className="text-xs text-[#a2aba5] leading-relaxed">
                  Deep dives on tool performance, architecture proposals, and real engineering lessons. Zero spam.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex items-stretch mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@domain.com"
                  required
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-black/50 border border-white/15 border-r-0 text-foreground placeholder:text-[#6e8898] focus:outline-none focus:border-lemon transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-lemon text-black font-mono font-bold text-xs uppercase hover:bg-white transition-colors flex items-center gap-1 shrink-0 cursor-target"
                >
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-end">
                <a
                  href="https://openrise.hashnode.dev/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-lemon hover:underline flex items-center gap-1.5"
                >
                  <span>RSS Feed</span>
                  <ArrowRightIcon className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
