import type { ReactNode } from "react";

type Props = {
  markdown: string;
};

export function MarkdownPanel({ markdown }: Props) {
  const lines = markdown.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`list-${nodes.length}`} className="ml-5 list-disc space-y-1 text-sm text-black/80">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${nodes.length}`} className="text-base font-semibold text-black">
          {line.slice(4)}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${nodes.length}`} className="text-lg font-semibold text-black">
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${nodes.length}`} className="text-xl font-semibold text-black">
          {line.slice(2)}
        </h1>,
      );
      continue;
    }

    nodes.push(
      <p key={`p-${nodes.length}`} className="text-sm leading-6 text-black/80">
        {line}
      </p>,
    );
  }

  flushList();

  return <div className="space-y-3">{nodes}</div>;
}
