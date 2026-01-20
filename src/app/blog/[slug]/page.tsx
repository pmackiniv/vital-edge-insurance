import { Container } from "@/components/Container";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Container className="py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Blog Post: {slug}</h1>
      <p className="mt-2 text-black/70">Dynamic route stub. Content coming next.</p>
    </Container>
  );
}
