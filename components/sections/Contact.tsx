import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/ui";
import { siteConfig } from "@/lib";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 border-t border-slate/20">
      <article className="max-w-6xl mx-auto">
        <h2 className="text-s uppercase tracking-[0.25em] text-slate mb-8 font-semibold font-heading">
          Contact
        </h2>
        
        <div className="max-w-3xl">
          <p className="text-xl text-foreground/90 mb-8">
            Have a question or want to collaborate? Reach out.
          </p>
          
          <div className="flex flex-col gap-4">
            <a 
              href="mailto:team@openrise.tech"
              className="flex items-center gap-3 text-slate hover:text-lemon transition-colors w-fit"
            >
              <MailIcon className="w-5 h-5" />
              <span>team@openrise.tech</span>
            </a>
            <a 
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate hover:text-lemon transition-colors cursor-target w-fit"
            >
              <GithubIcon className="w-5 h-5" />
              <span>github.com/openrise-hub</span>
            </a>
            <a 
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-slate hover:text-lemon transition-colors cursor-target w-fit"
            >
              <LinkedinIcon className="w-5 h-5" />
              <span>linkedin.com/company/openrise-dev</span>
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
