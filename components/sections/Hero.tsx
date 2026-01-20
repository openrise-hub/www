import { ButtonLink, GithubIcon, LinkedinIcon } from "@/components/ui";
import { siteConfig } from "@/lib";
import Image from "next/image";
import Logo3D from "../ui/3DLogo";

export default function Hero() {
  return (
    <section className="min-h-[100dvh] flex items-center px-6 py-20">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/*Left - Logo/Brand Area */}
        <div className="flex items-center justify-center lg:justify-start">
          {/*
          <Image
            src="/OpenriseLogoNoBG.svg"
            alt="Openrise Logo"
            width={500}
            height={500}
            priority
            className="w-full max-w-sm lg:max-w-lg select-none pointer-events-none"
          />
          */}
          <Logo3D />
        </div>

        {/* Right - Content Area */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="hero-title text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-heading">
            <span>HELPFUL</span>{" "}
            <span>SOLUTIONS</span>{" "}
            <span>FOR</span>{" "}
            <span>THE</span>{" "}
            <span>OPEN</span>{" "}
            <span>SOURCE</span>{" "}
            <span>COMMUNITY.</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg text-slate max-w-md">
            We build software tools designed to solve real problems.
          </p>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4">
             <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-lemon transition-colors duration-200"
              aria-label="GitHub"
            >
              <GithubIcon className="w-6 h-6" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate hover:text-lemon transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </div>
          
          {/* CTA Button */}
          <div className="pt-2">
            <ButtonLink
              className="cursor-target"
              href={siteConfig.links.github}
              external
              variant="primary"
            >
              View Repositories
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
