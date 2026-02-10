import { APPOINTMENT_SPONSOR_SEEDS, SPONSOR_ALIAS_SEEDS, TPMO_ALIAS_MAP_VERSION } from "../../src/lib/tpmo/constants";
import { ensureTpmoTables } from "../../src/lib/tpmo/db";
import { getPrismaClient } from "../../src/lib/prisma";

async function main() {
  const prisma = getPrismaClient();
  if (!prisma) {
    throw new Error("DATABASE_URL is required for tpmo:seed.");
  }
  await ensureTpmoTables();

  const effectiveDate = new Date();
  const state = "FL";

  for (const seed of APPOINTMENT_SPONSOR_SEEDS) {
    await prisma.appointmentSponsor.upsert({
      where: {
        sponsorKey_state: {
          sponsorKey: seed.sponsorKey,
          state: seed.state || state,
        },
      },
      create: {
        sponsorKey: seed.sponsorKey,
        displayName: seed.displayName,
        status: seed.status || "active",
        state: seed.state || state,
        effectiveDate,
        countsAsSeparateOrg: seed.countsAsSeparateOrg,
      },
      update: {
        displayName: seed.displayName,
        status: seed.status || "active",
        countsAsSeparateOrg: seed.countsAsSeparateOrg,
      },
    });
  }

  for (const aliasSeed of SPONSOR_ALIAS_SEEDS) {
    const version = aliasSeed.version || TPMO_ALIAS_MAP_VERSION;
    await prisma.sponsorAlias.upsert({
      where: {
        alias_sponsorKey_version: {
          alias: aliasSeed.alias,
          sponsorKey: aliasSeed.sponsorKey,
          version,
        },
      },
      create: {
        alias: aliasSeed.alias,
        sponsorKey: aliasSeed.sponsorKey,
        priority: aliasSeed.priority ?? 100,
        active: aliasSeed.active !== false,
        version,
      },
      update: {
        priority: aliasSeed.priority ?? 100,
        active: aliasSeed.active !== false,
      },
    });
  }

  const sponsors = await prisma.appointmentSponsor.count();
  const aliases = await prisma.sponsorAlias.count();
  console.info(`Seed complete: ${sponsors} sponsors, ${aliases} aliases.`);
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
