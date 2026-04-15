/**
 * Hero image compression script.
 *
 * Converts public/images/hero/*.jpg → WebP at ≤150KB / 80% quality.
 * Original JPEGs are preserved with a .orig.jpg suffix.
 *
 * Run after installing dependencies:
 *   pnpm install
 *   node scripts/compress-images.mjs
 */

import sharp from "sharp";
import { readdir, rename, stat } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HERO_DIR = join(__dirname, "..", "public", "images", "hero");
const TARGET_KB = 150;

async function compress() {
  const files = await readdir(HERO_DIR);
  const images = files.filter(
    (f) => /\.(jpg|jpeg|png)$/i.test(f) && !f.endsWith(".orig.jpg"),
  );

  if (images.length === 0) {
    console.log("No images to compress.");
    return;
  }

  console.log(`Compressing ${images.length} images in ${HERO_DIR}\n`);

  for (const file of images) {
    const srcPath = join(HERO_DIR, file);
    const name = basename(file, extname(file));
    const outPath = join(HERO_DIR, `${name}.webp`);
    const origPath = join(HERO_DIR, `${name}.orig.jpg`);

    const beforeStat = await stat(srcPath);
    const beforeKb = Math.round(beforeStat.size / 1024);

    // Back up original
    await rename(srcPath, origPath).catch(() => {}); // skip if already backed up

    // Convert to WebP — try quality 80, reduce if still over target
    let quality = 80;
    let outputInfo;
    do {
      outputInfo = await sharp(origPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality })
        .toFile(outPath);
      quality -= 5;
    } while (outputInfo.size > TARGET_KB * 1024 && quality > 30);

    const afterKb = Math.round(outputInfo.size / 1024);
    const saved = Math.round(((beforeKb - afterKb) / beforeKb) * 100);

    console.log(
      `  ${file.padEnd(20)} ${beforeKb}KB → ${afterKb}KB  (${saved}% saved, quality=${quality + 5})`,
    );
  }

  console.log(
    "\nDone. Update any <Image src> references from .jpg to .webp, or keep .jpg — Next.js will serve WebP automatically via its optimizer.",
  );
}

compress().catch((err) => {
  console.error("Compression failed:", err.message);
  process.exit(1);
});
