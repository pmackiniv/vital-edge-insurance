type JsonLdValue = Record<string, unknown>;

type StructuredDataProps = {
  entries: JsonLdValue[];
};

export function StructuredData({ entries }: StructuredDataProps) {
  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
