import sharp from 'sharp';
import { readdir, stat, rename, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = 'public/images';
const BACKUP_DIR = 'public/images-original';
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 82;

async function getImageFiles(dir) {
  const entries = await readdir(dir);
  const validExts = ['.jpg', '.jpeg', '.png', '.webp'];
  return entries.filter(f => validExts.includes(extname(f).toLowerCase()));
}

async function optimizeImages() {
  const files = await getImageFiles(IMAGES_DIR);
  console.log(`Found ${files.length} images to optimize\n`);

  // Create backup directory
  await mkdir(BACKUP_DIR, { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;
  let skipped = 0;

  for (const file of files) {
    const inputPath = join(IMAGES_DIR, file);
    const backupPath = join(BACKUP_DIR, file);
    const ext = extname(file).toLowerCase();

    const beforeStat = await stat(inputPath);
    const beforeSize = beforeStat.size;
    totalBefore += beforeSize;

    // Skip files already small (< 500KB)
    if (beforeSize < 500 * 1024) {
      console.log(`  SKIP ${file} (already ${(beforeSize / 1024).toFixed(0)}KB)`);
      totalAfter += beforeSize;
      skipped++;
      continue;
    }

    try {
      // Backup original
      await rename(inputPath, backupPath);

      // Determine output format based on extension
      const image = sharp(backupPath).resize({
        width: MAX_WIDTH,
        height: MAX_WIDTH,
        fit: 'inside',
        withoutEnlargement: true,
      });

      if (ext === '.png') {
        await image.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(inputPath);
      } else {
        // JPG output for everything else (including .JPG, .jpeg)
        const outputPath = inputPath.replace(/\.JPG$/i, '.jpg');
        await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outputPath || inputPath);
      }

      const afterStat = await stat(inputPath);
      const afterSize = afterStat.size;
      totalAfter += afterSize;

      const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(0);
      console.log(`  OK ${file}: ${(beforeSize / 1024 / 1024).toFixed(1)}MB → ${(afterSize / 1024).toFixed(0)}KB (-${reduction}%)`);
    } catch (err) {
      console.error(`  ERR ${file}: ${err.message}`);
      // Restore from backup on error
      try {
        await rename(backupPath, inputPath);
      } catch {}
      totalAfter += beforeSize;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total files: ${files.length} (${skipped} skipped)`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
  console.log(`\nOriginals backed up in: ${BACKUP_DIR}/`);
}

optimizeImages().catch(console.error);
