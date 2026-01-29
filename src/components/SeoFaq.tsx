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
    <section className="rounded-2xl border border-white/30 bg-white/35 p-6 text-white/90 backdrop-blur">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm text-white/85">
        {items.map((item) => (
          <div key={item.question}>
            <div className="font-semibold text-white">{item.question}</div>
            <p className="mt-2 leading-7">{item.answer}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
