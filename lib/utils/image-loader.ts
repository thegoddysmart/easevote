/**
 * Optimizes Cloudinary URLs by injecting transformations for width, height,
 * auto-format (f_auto), and auto-quality (q_auto).
 * 
 * @param url The raw remote image URL.
 * @param width The target display width.
 * @param height The target display height.
 * @returns The optimized Cloudinary URL, or the original URL if not hosted on Cloudinary.
 */
export function getCloudinaryOptimizedUrl(url: string, width: number, height: number): string {
  if (!url) return "";
  if (typeof url !== "string") return url;
  if (!url.includes("cloudinary.com")) return url;
  
  // Inject transformation options directly after "/upload/"
  const transformation = `w_${width},h_${height},c_fill,g_auto,f_auto,q_auto`;
  return url.replace("/upload/", `/upload/${transformation}/`);
}
