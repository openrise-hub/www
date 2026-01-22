import { ButtonLink } from "@/components/ui";
import { siteConfig } from "@/lib";

export default function Community() {
  return (
    <section id="community" className="py-20 px-6 border-t border-slate/20">
      <article className="max-w-6xl mx-auto">
        <h2 className="text-s uppercase tracking-[0.25em] text-slate mb-8 font-semibold font-heading">
          Community
        </h2>
        
        <div className="max-w-3xl">
          <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 mb-8">
            Join our community of developers building useful tools together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <ButtonLink
              href={siteConfig.links.github}
              external
              variant="primary"
              className="cursor-target"
            >
              GitHub Discussions
            </ButtonLink>
            <ButtonLink
              href={siteConfig.links.linkedin}
              external
              variant="primary"
              className="cursor-target"
            >
              LinkedIn
            </ButtonLink>
          </div>
        </div>
      </article>
    </section>
  );
}
