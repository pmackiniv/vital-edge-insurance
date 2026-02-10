import path from "node:path";
import { ingestCmsLandscape } from "../../src/lib/tpmo/cmsLandscapeIngest";
import { getPrismaClient } from "../../src/lib/prisma";

function readArg(flag: string): string | null {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const yearRaw = readArg("--year");
  const fileRaw = readArg("--file");
  const versionRaw = readArg("--version");

  const year = Number(yearRaw) || new Date().getFullYear();
  const filePath = fileRaw ? path.resolve(process.cwd(), fileRaw) : "";
  const datasetVersion = (versionRaw || `${year}.01.01`).trim();

  if (!filePath) {
    throw new Error("Missing --file argument. Example: --file ./data/cms/landscape_2026.csv");
  }

  const result = await ingestCmsLandscape({
    filePath,
    planYear: year,
    datasetVersion,
  });

  console.info(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    const prisma = getPrismaClient();
    await prisma?.$disconnect();
  });
