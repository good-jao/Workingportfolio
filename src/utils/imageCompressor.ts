/**
 * Client-side high performance image compressor for Cloud Firestore compatibility.
 * Keeps document sizes well below Firestore's 1MB limit while maintaining
 * crisp HD visual fidelity for portfolio showcases and avatars.
 */

export async function compressImage(
  fileOrUrl: File | string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's already an external HTTP/HTTPS URL, no compression needed
    if (typeof fileOrUrl === 'string' && (fileOrUrl.startsWith('http://') || fileOrUrl.startsWith('https://'))) {
      return resolve(fileOrUrl);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      let width = img.width;
      let height = img.height;

      if (width <= 0 || height <= 0) {
        width = 800;
        height = 600;
      }

      // Calculate proportional downscale
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback to original
        if (typeof fileOrUrl === 'string') return resolve(fileOrUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrUrl as File);
        return;
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to JPEG base64
      let compressed = canvas.toDataURL('image/jpeg', quality);

      // If still larger than 250KB, reduce quality one step
      if (compressed.length > 350000 && quality > 0.6) {
        compressed = canvas.toDataURL('image/jpeg', 0.65);
      }

      resolve(compressed);
    };

    img.onerror = () => {
      // In case image loading fails, return original data or reject gracefully
      if (typeof fileOrUrl === 'string') {
        resolve(fileOrUrl);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrUrl as File);
      }
    };

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
