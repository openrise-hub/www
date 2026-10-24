'use client';

import { GithubIcon, LinkedinIcon, ArrowRightIcon } from "@/components/ui";
import { siteConfig } from "@/lib";

export default function Community() {
  return (
    <section id="community" className="py-28 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-lemon" />
          <h2 className="text-xs uppercase tracking-[0.28em] text-lemon font-mono font-semibold">
            Community & Collaboration
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6 font-sans">
              Built by developers, for everyone.
            </h3>
            <p className="text-lg leading-relaxed text-muted text-[#a2aba5] mb-8">
              Join our growing community of maintainers and contributors. Whether you are looking to solve a real tooling problem, submit your first open-source pull request, or review RFCs, you are welcome here.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href={`${siteConfig.links.github}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="sing-cta sing-cta--primary cursor-target"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Discussions</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="sing-cta sing-cta--ghost cursor-target"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn Updates</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-6 rounded-none bg-[rgba(36,36,35,0.7)] backdrop-blur-md border border-[rgba(249,233,0,0.18)] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.8)]">
              <span className="text-xs font-mono text-lemon tracking-widest uppercase block mb-2">
                Ecosystem Principles
              </span>
              <ul className="space-y-3 text-sm text-[#fcf7f8]/90 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lemon" />
                  <span>100% Free & Open Source (MIT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lemon" />
                  <span>Active Junior Developer Mentorship</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lemon" />
                  <span>Zero Commercial Gatekeeping</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lemon" />
                  <span>Public RFCs & Open Technical Roadmap</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
