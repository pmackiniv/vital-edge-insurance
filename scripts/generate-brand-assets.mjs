import fs from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/brand/vital-edge-logo.png";

async function main() {
  await fs.mkdir("public", { recursive: true });

  // Favicon (32x32) with padding
  await sharp(SRC)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile("public/favicon-32.png");

  // Apple touch icon (180x180) with padding
  await sharp(SRC)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile("public/apple-touch-icon.png");

  // OG image (1200x630)
  const base = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 248, g: 250, b: 252, alpha: 1 },
    },
  });

  const logoBuffer = await sharp(SRC)
    .resize(520, 220, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await base
    .composite([{ input: logoBuffer, left: 80, top: 140 }])
    .png()
    .toFile("public/og.png");

  console.log("Generated: public/favicon-32.png, public/apple-touch-icon.png, public/og.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
