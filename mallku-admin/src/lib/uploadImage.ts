const MAX_WIDTH = 1920;
const QUALITY = 0.85;

/**
 * Redimensiona una imagen en el cliente usando Canvas API.
 * Si el ancho es menor a MAX_WIDTH, no la agranda.
 * Siempre convierte a JPEG con calidad 0.85.
 */
async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      const scale = width > MAX_WIDTH ? MAX_WIDTH / width : 1;
      const targetW = Math.round(width * scale);
      const targetH = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas no disponible'));

      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Error al procesar imagen'));
          resolve(blob);
        },
        'image/jpeg',
        QUALITY
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = url;
  });
}

/**
 * Redimensiona y sube una imagen al servidor.
 * Devuelve la URL pública de Vercel Blob.
 */
export async function uploadImage(
  file: File,
  token: string,
  onProgress?: (state: 'resizing' | 'uploading') => void
): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8787/api/v1';

  // 1. Resize client-side
  onProgress?.('resizing');
  const resized = await resizeImage(file);

  // 2. Crear FormData
  const formData = new FormData();
  const filename = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  formData.append('file', new File([resized], filename, { type: 'image/jpeg' }));

  // 3. Upload al API
  onProgress?.('uploading');
  const response = await fetch(`${apiUrl}/admin/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as any).message || `Error ${response.status} al subir imagen`);
  }

  const data = await response.json();
  return data.url as string;
}
