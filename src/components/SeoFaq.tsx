type FaqItem = {
  question: string;
  answer: string;
};

type SeoFaqProps = {
  title?: string;
  items: FaqItem[];
};

export function SeoFaq({ title = "Frequently asked questions", items }: SeoFaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="rounded-3xl border border-[var(--ve-teal)]/10 bg-white p-6 text-slate-900 shadow-[0_18px_52px_rgba(15,23,42,0.08)]">
      <h2 className="font-display text-3xl font-bold tracking-normal text-[var(--ve-teal)]">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-[var(--ve-teal)]/10 bg-[var(--ve-bg)]/55 p-5">
            <div className="font-sans text-base font-extrabold text-[var(--ve-teal)]">{item.question}</div>
            <p className="mt-2 font-sans text-sm leading-7 text-slate-700">{item.answer}</p>
          </article>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
