import { Container } from "@/components/Container";
import { resources } from "@/lib/knowledgeBase";

export default function ResourcesPage() {
  return (
    <Container className="py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-black">Resources</h1>
        <p className="mt-3 text-sm leading-6 text-black/70">
          Client education hub with quick primers and checklists. More guides coming soon.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((item) => (
          <section key={item.slug} id={item.slug} className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="text-sm font-semibold text-black">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-black/70">{item.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/50">
              {item.tags.map((tag) => (
                <span key={`${item.slug}-${tag}`} className="rounded-full border border-black/10 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
