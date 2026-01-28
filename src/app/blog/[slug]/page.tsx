import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
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
    <Container className="py-14">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/40">{post.date}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-black/70">{post.summary}</p>

        <div className="mt-10 space-y-10">
          {post.sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-xl font-semibold text-black">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-7 text-black/70">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2 text-sm leading-7 text-black/70">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 inline-flex h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.code && (
                <pre className="overflow-x-auto rounded-2xl border border-black/10 bg-black/95 p-4 text-xs text-white">
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        {post.quotes && (
          <div className="mt-12 space-y-6">
            {post.quotes.map((quote) => (
              <figure key={quote.author} className="rounded-2xl border border-black/10 bg-white p-6">
                <blockquote className="text-sm leading-7 text-black/70">“{quote.quote}”</blockquote>
                <figcaption className="mt-4 text-xs font-semibold text-black">— {quote.author}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </article>
    </Container>
  );
}
