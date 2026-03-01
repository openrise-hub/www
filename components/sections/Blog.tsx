import { ButtonLink } from "@/components/ui";

export default function Blog() {
  return (
    <section id="blog" className="py-24 px-6">
      <article className="max-w-6xl mx-auto">
        <h2 className="text-base uppercase tracking-[0.25em] text-slate mb-12 font-semibold font-heading">
          Blog
        </h2>
        
        <div className="max-w-3xl">
          <p className="text-xl text-foreground/90 mb-6">
            Read our latest updates, technical writeups, and lessons learned.
          </p>
          
          <ButtonLink
            href="https://openrise.hashnode.dev/"
            external
            variant="primary"
            className="cursor-target"
          >
            Visit Blog →
          </ButtonLink>
        </div>
      </article>
    </section>
  );
}
