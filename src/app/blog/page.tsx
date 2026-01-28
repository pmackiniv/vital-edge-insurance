import Link from "next/link";
import { Container } from "@/components/Container";
import { blogPosts } from "@/lib/blogPosts";

export default function Page() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Blog</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Updates on product direction, MCP Apps, and how interactive UI changes the way tool-based workflows feel.
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">{post.date}</p>
            <h2 className="mt-3 text-xl font-semibold text-black">
              <Link className="hover:text-black/70" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/70">{post.summary}</p>
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-[var(--brand-blue)] hover:text-[var(--brand-green)]"
              href={`/blog/${post.slug}`}
            >
              Read the update →
            </Link>
          </article>
        ))}
      </div>
    </Container>
  );
}
