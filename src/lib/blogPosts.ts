export type BlogSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string;
};

export type BlogQuote = {
  quote: string;
  author: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  sections: BlogSection[];
  quotes?: BlogQuote[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "mcp-apps-interactive-ui",
    title: "MCP Apps: interactive UI for tool-driven workflows",
    summary:
      "MCP Apps bring interactive dashboards, configuration wizards, and real-time monitoring directly into tool-driven conversations.",
    date: "2024-09-18",
    sections: [
      {
        title: "Where MCP Apps shine",
        paragraphs: [
          "MCP Apps are built for moments where a visual interface is faster than back-and-forth prompts. They keep the model in the loop while giving people direct control over complex workflows.",
        ],
        bullets: [
          "Data exploration: a sales analytics tool renders an interactive dashboard where users filter by region, drill into accounts, and export reports without leaving the conversation.",
          "Configuration wizards: deployment tools can reveal dependent fields so production environments surface security options while staging environments keep defaults simple.",
          "Document review: contract analysis tools can show PDFs inline with highlighted clauses and allow approvals or flags that the model can react to immediately.",
          "Real-time monitoring: server health tools can stream live metrics and update as systems change without constant re-invocation of the tool.",
        ],
      },
      {
        title: "How it works",
        paragraphs: [
          "The MCP Apps architecture relies on two key MCP primitives:",
        ],
        bullets: [
          "Tools with UI metadata: tools include a _meta.ui.resourceUri field that points to a UI resource.",
          "UI resources: server-side resources served via the ui:// scheme that deliver bundled HTML and JavaScript.",
        ],
        code: `// Tool with UI metadata\n{\n  name: "visualize_data",\n  description: "Visualize data as an interactive chart",\n  inputSchema: { /* ... */ },\n  _meta: {\n    ui: {\n      resourceUri: "ui://charts/interactive"\n    }\n  }\n}`,
      },
      {
        title: "Why MCP Apps?",
        paragraphs: [
          "MCP makes it easy for models to query data and take actions, but users still need visibility and control. A database query might return hundreds of rows; the model can summarize them, but people want to sort, filter, and click into details without re-prompting the tool every time.",
          "MCP Apps close the context gap. The UI handles live updates, media viewers, persistent state, and direct manipulation, while the model sees the user’s choices and stays responsive in real time.",
        ],
      },
      {
        title: "The App API",
        paragraphs: [
          "Developers can use the @modelcontextprotocol/ext-apps package to create UI-to-host communication that feels native inside MCP clients.",
        ],
        code: `import { App } from "@modelcontextprotocol/ext-apps";\n\nconst app = new App();\nawait app.connect();\n\n// Receive tool results from the host\napp.ontoolresult = (result) => {\n  renderChart(result.data);\n};\n\n// Call server tools from the UI\nconst response = await app.callServerTool({\n  name: "fetch_details",\n  arguments: { id: "123" },\n});\n\n// Update model context\nawait app.updateModelContext({\n  content: [{ type: "text", text: "User selected option B" }],\n});`,
      },
      {
        title: "Security model",
        paragraphs: [
          "Running server-hosted UI code requires layered defenses. MCP Apps combine sandboxing and auditability to keep hosts and users in control.",
        ],
        bullets: [
          "Iframe sandboxing with restricted permissions.",
          "Pre-declared templates so hosts can review HTML content before rendering.",
          "Auditable JSON-RPC messages for every UI-to-host interaction.",
          "User consent requirements for UI-initiated tool calls.",
        ],
      },
      {
        title: "The future of agentic UI frameworks",
        paragraphs: [
          "MCP-UI and the OpenAI Apps SDK pioneered these interaction patterns. MCP Apps now standardize the approach across clients while keeping existing SDKs viable.",
          "If you already use MCP-UI, you can keep using it. Migration to the official extension is straightforward once you are ready.",
        ],
      },
      {
        title: "Client support",
        paragraphs: [
          "MCP Apps are already supported across a growing set of clients:",
        ],
        bullets: [
          "Claude (web and desktop).",
          "Goose.",
          "Visual Studio Code Insiders.",
          "ChatGPT (starting this week).",
        ],
      },
    ],
    quotes: [
      {
        quote:
          "I am excited about the possibilities that MCP Apps opens up. Having seen a glimpse of what is possible, I cannot wait to see what the community will build.",
        author: "David Soria Parra, Co-Creator of MCP and Member of Technical Staff, Anthropic",
      },
      {
        quote:
          "MCP Apps builds upon the foundations of MCP-UI and the ChatGPT Apps SDK to give people a rich visually interactive experience. We are proud to support this new open standard and look forward to seeing what developers build with it as we grow the selection of apps available in ChatGPT.",
        author: "Nick Cooper, Member of Technical Staff, OpenAI",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
