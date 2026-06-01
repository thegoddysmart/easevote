import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import { join, basename, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = join(__dirname, "..", "public", "images");

async function walkDir(dir) {
  const list = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of list) {
    const res = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(res)));
    } else {
      files.push(res);
    }
  }
  return files;
}

async function convertAll() {
  console.log(`Starting recursive image conversion in: ${IMAGES_ROOT}\n`);
  const allFiles = await walkDir(IMAGES_ROOT);
  
  const targetImages = allFiles.filter(file => {
    const ext = extname(file).toLowerCase();
    return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
  });

  if (targetImages.length === 0) {
    console.log("No PNG or JPG images found to convert.");
    return;
  }

  console.log(`Found ${targetImages.length} images to convert.\n`);

  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  for (const srcPath of targetImages) {
    const dir = dirname(srcPath);
    const ext = extname(srcPath);
    const name = basename(srcPath, ext);
    const outPath = join(dir, `${name}.webp`);

    try {
      const beforeStat = await stat(srcPath);
      totalBeforeBytes += beforeStat.size;
      const beforeKb = Math.round(beforeStat.size / 1024);

      // Convert using sharp
      let outputInfo = await sharp(srcPath)
        .webp({ quality: 80 }) // 80% is the industry standard sweet spot
        .toFile(outPath);

      totalAfterBytes += outputInfo.size;
      const afterKb = Math.round(outputInfo.size / 1024);
      const saved = Math.round(((beforeKb - afterKb) / beforeKb) * 100);

      console.log(`[CONVERTED] ${basename(srcPath)} (${beforeKb} KB) -> ${basename(outPath)} (${afterKb} KB) - ${saved}% saved`);

      // Delete the original file as requested
      await unlink(srcPath);
      console.log(`[DELETED] Original file: ${basename(srcPath)}`);
    } catch (err) {
      console.error(`[ERROR] Failed to convert ${basename(srcPath)}:`, err.message);
    }
  }

  // Also clean up any ".orig.jpg" or ".orig.png" leftover backups if any exist
  for (const srcPath of allFiles) {
    if (srcPath.endsWith(".orig.jpg") || srcPath.endsWith(".orig.png")) {
      try {
        await unlink(srcPath);
        console.log(`[DELETED] Leftover backup: ${basename(srcPath)}`);
      } catch (err) {
        // ignore
      }
    }
  }

  const beforeMb = (totalBeforeBytes / (1024 * 1024)).toFixed(2);
  const afterMb = (totalAfterBytes / (1024 * 1024)).toFixed(2);
  console.log(`\n===========================================`);
  console.log(`FINISHED CONVERSION!`);
  console.log(`Total size before: ${beforeMb} MB`);
  console.log(`Total size after:  ${afterMb} MB`);
  console.log(`Savings: ${((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes * 100).toFixed(1)}%`);
  console.log(`===========================================`);
}

convertAll().catch(err => {
  console.error("Critical failure during conversion:", err);
});
