import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { PremiumDisclosure, PremiumInteriorHero } from "@/components/PremiumInteriorPage";
import { blogPosts, getBlogPostBySlug } from "@/lib/blogPosts";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <PremiumInteriorHero
        eyebrow={post.date}
        title={post.title}
        subtitle={post.summary}
        actions={[
          { label: "Resources", href: "/resources", kind: "primary" },
          { label: "Request a Call", href: "/contact", kind: "gold" },
        ]}
      >
        <PremiumDisclosure>
          Article content is educational only and does not provide plan-specific recommendations.
        </PremiumDisclosure>
      </PremiumInteriorHero>

    <Container className="py-12">
      <article className="mx-auto max-w-3xl rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] md:p-8">

        <div className="mt-10 space-y-10">
          {post.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="font-display text-2xl font-bold tracking-normal text-[var(--ve-teal)]">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="font-sans text-sm leading-7 text-slate-700">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 font-sans text-sm leading-7 text-slate-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--ve-gold)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.code && (
                <pre className="overflow-x-auto rounded-2xl border border-[var(--ve-teal)]/10 bg-[var(--ve-teal)] p-4 text-xs text-white">
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        {post.quotes && (
          <div className="mt-12 space-y-6">
            {post.quotes.map((quote) => (
              <figure key={quote.author} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/55 p-6">
                <blockquote className="text-sm leading-7 text-slate-700">“{quote.quote}”</blockquote>
                <figcaption className="mt-4 text-xs font-bold text-[var(--ve-teal)]">— {quote.author}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </article>
    </Container>
    </>
  );
}
