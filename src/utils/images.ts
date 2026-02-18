import type { ImageMetadata } from 'astro';

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

export function resolveImage(publicPath: string): ImageMetadata {
  // Convert '/images/Quilmes 1.jpg' to '/src/assets/images/Quilmes 1.jpg'
  const assetPath = publicPath.replace('/images/', '/src/assets/images/');
  const mod = imageModules[assetPath];
  if (mod) return mod.default;

  // Case-insensitive fallback (handles .JPG → .jpg renaming)
  const lowerPath = assetPath.toLowerCase();
  const found = Object.entries(imageModules).find(
    ([key]) => key.toLowerCase() === lowerPath
  );
  if (found) return found[1].default;

  throw new Error(`Image not found: ${publicPath} (tried: ${assetPath})`);
}
