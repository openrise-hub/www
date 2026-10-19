'use client';

import { GithubIcon, LinkedinIcon, MailIcon, ArrowRightIcon } from "@/components/ui";
import Contact3DLogo from "@/components/ui/Contact3DLogo";
import { siteConfig } from "@/lib";

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 relative z-10 border-t border-[rgba(249,233,0,0.12)]">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-none p-8 md:p-14 bg-gradient-to-b from-[rgba(45,45,43,0.9)] to-[rgba(30,30,29,0.95)] border border-[rgba(249,233,0,0.35)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] mb-16">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <span className="text-xs font-mono tracking-[0.28em] text-lemon uppercase font-semibold block mb-4">
                LAUNCHPAD
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 font-sans">
                Ready to build?
              </h2>
              <p className="text-lg md:text-xl text-[#a2aba5] mb-8 leading-relaxed">
                Explore our active repositories on GitHub, join community discussions, or contribute code to tools that make open-source development better for everyone.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sing-cta sing-cta--primary cursor-target"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Join on GitHub</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </a>
                <a
                  href="mailto:team@openrise.tech"
                  className="sing-cta sing-cta--ghost cursor-target"
                >
                  <MailIcon className="w-4 h-4" />
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center p-2 md:p-4">
              <Contact3DLogo />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="mailto:team@openrise.tech"
            className="flex items-center gap-4 p-5 rounded-none bg-[rgba(36,36,35,0.6)] backdrop-blur-md border border-[rgba(249,233,0,0.15)] hover:border-lemon transition-all duration-300 cursor-target group"
          >
            <div className="w-10 h-10 rounded-none bg-lemon/10 border border-lemon/30 flex items-center justify-center text-lemon group-hover:scale-105 transition-transform">
              <MailIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate uppercase tracking-wider block">Email</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-lemon transition-colors">team@openrise.tech</span>
            </div>
          </a>

          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-none bg-[rgba(36,36,35,0.6)] backdrop-blur-md border border-[rgba(249,233,0,0.15)] hover:border-lemon transition-all duration-300 cursor-target group"
          >
            <div className="w-10 h-10 rounded-none bg-lemon/10 border border-lemon/30 flex items-center justify-center text-lemon group-hover:scale-105 transition-transform">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate uppercase tracking-wider block">Organization</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-lemon transition-colors">github.com/openrise-hub</span>
            </div>
          </a>

          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 rounded-none bg-[rgba(36,36,35,0.6)] backdrop-blur-md border border-[rgba(249,233,0,0.15)] hover:border-lemon transition-all duration-300 cursor-target group"
          >
            <div className="w-10 h-10 rounded-none bg-lemon/10 border border-lemon/30 flex items-center justify-center text-lemon group-hover:scale-105 transition-transform">
              <LinkedinIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate uppercase tracking-wider block">Network</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-lemon transition-colors">LinkedIn / openrise-dev</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
