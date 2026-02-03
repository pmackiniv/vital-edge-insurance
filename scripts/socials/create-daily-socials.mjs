import { mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const today = new Date();
const defaultDate = today.toISOString().slice(0, 10);
const dateArg = process.argv[2] || defaultDate;

const root = process.cwd();
const templatesDir = path.join(root, "templates", "socials");
const outputDir = path.join(root, "outputs", "daily", dateArg);

const files = [
  "socials.linkedIn.md",
  "socials.facebook.md",
  "socials.instagram.md",
  "socials.nextdoor.md",
  "socials.reddit.md",
  "gbp.post.md",
];

const readme = `# Daily Social Drafts (${dateArg})

Status: draft-only. Review for compliance before posting.

Checklist:
- Education-first; no plan recommendations or carrier mentions.
- Medicare: call-only and include TPMO disclaimer language if referenced.
- No SSN/MBI/PHI collection.
`;

await mkdir(outputDir, { recursive: true });

await Promise.all(
  files.map((file) => copyFile(path.join(templatesDir, file), path.join(outputDir, file))),
);

await writeFile(path.join(outputDir, "README.md"), readme, "utf8");

console.log(`Created daily socials drafts in ${outputDir}`);
