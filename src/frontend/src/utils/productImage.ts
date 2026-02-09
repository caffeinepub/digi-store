import { ExternalBlob } from '../backend';

/**
 * Safely extracts the primary product image URL from a Product's images array.
 * Returns null if no images are available or if an error occurs.
 * This centralizes ExternalBlob.getDirectURL() usage with proper error handling.
 */
export function getProductImageUrl(images: ExternalBlob[]): string | null {
  try {
    if (!images || images.length === 0) {
      return null;
    }
    return images[0].getDirectURL();
  } catch (error) {
    console.error('Error getting product image URL:', error);
    return null;
  }
}
