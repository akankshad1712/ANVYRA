/**
 * ANVYRA Product Image Mapper
 *
 * Maps product names / categories to real images in /public/collections/.
 * Used as fallback when a product has no images stored in the database.
 *
 * All paths are Next.js public-folder paths (no /public prefix).
 * The "Straight-fit Jeans" folder has a space — next/image handles it correctly.
 */

// ─── All available collection images ─────────────────────────────────────────
export const COLLECTION_IMAGES = {
  jacket_black:   "/collections/Jackets/black.png",
  jacket_blue:    "/collections/Jackets/blue.png",
  jacket_white:   "/collections/Jackets/white.png",

  oversize_black: "/collections/oversize/oversize_black.png",
  oversize_grey:  "/collections/oversize/oversize_grey.png",
  oversize_white: "/collections/oversize/oversize_white.png",

  shirt_blue:     "/collections/shirt/shirt_b.png",
  shirt_black:    "/collections/shirt/shirt_black.png",
  shirt_white:    "/collections/shirt/shirt_white.png",

  jeans_black:    "/collections/Straight-fit%20Jeans/Straight-fit%20Jeans_black.png",
  jeans_blue:     "/collections/Straight-fit%20Jeans/Straight-fit%20Jeans_blue.png",

  trouser_black:  "/collections/trousers/trouser_black.png",
  trouser_blue:   "/collections/trousers/trouser_blue.png",
  trouser_pink:   "/collections/trousers/trouser_pink.png",
  trouser_white:  "/collections/trousers/trouser_white.png",
} as const;

/** Non-empty fallback for any product with no matching image */
export const DEFAULT_FALLBACK = COLLECTION_IMAGES.shirt_black;

// ─── Category slug → best representative image ───────────────────────────────
export const CATEGORY_IMAGES: Record<string, string> = {
  men:         COLLECTION_IMAGES.jacket_black,
  women:       COLLECTION_IMAGES.trouser_pink,
  shirts:      COLLECTION_IMAGES.shirt_black,
  shirt:       COLLECTION_IMAGES.shirt_black,
  jackets:     COLLECTION_IMAGES.jacket_black,
  jacket:      COLLECTION_IMAGES.jacket_black,
  oversized:   COLLECTION_IMAGES.oversize_grey,
  oversize:    COLLECTION_IMAGES.oversize_grey,
  trousers:    COLLECTION_IMAGES.trouser_blue,
  trouser:     COLLECTION_IMAGES.trouser_blue,
  jeans:       COLLECTION_IMAGES.jeans_blue,
  denim:       COLLECTION_IMAGES.jeans_blue,
  shoes:       COLLECTION_IMAGES.jacket_white,
  accessories: COLLECTION_IMAGES.oversize_white,
};

/**
 * Given product name, optional category name, and optional color,
 * returns the best matching local collection image.
 */
export function getProductImage(
  productName: string,
  categoryName?: string,
  color?: string
): string {
  const name = (productName  ?? "").toLowerCase();
  const cat  = (categoryName ?? "").toLowerCase();
  const col  = (color        ?? "").toLowerCase();

  // Jeans / Denim
  if (name.includes("jean") || name.includes("denim") || cat.includes("jean") || cat.includes("denim")) {
    return col.includes("black") ? COLLECTION_IMAGES.jeans_black : COLLECTION_IMAGES.jeans_blue;
  }

  // Trousers / Pants
  if (name.includes("trouser") || name.includes("pant") || cat.includes("trouser")) {
    if (col.includes("pink"))  return COLLECTION_IMAGES.trouser_pink;
    if (col.includes("white")) return COLLECTION_IMAGES.trouser_white;
    if (col.includes("black")) return COLLECTION_IMAGES.trouser_black;
    return COLLECTION_IMAGES.trouser_blue;
  }

  // Jackets / Coats / Blazers
  if (name.includes("jacket") || name.includes("coat") || name.includes("blazer") || cat.includes("jacket")) {
    if (col.includes("white")) return COLLECTION_IMAGES.jacket_white;
    if (col.includes("blue"))  return COLLECTION_IMAGES.jacket_blue;
    return COLLECTION_IMAGES.jacket_black;
  }

  // Oversized / Hoodies
  if (name.includes("oversized") || name.includes("oversize") || name.includes("hoodie") || cat.includes("oversize")) {
    if (col.includes("white")) return COLLECTION_IMAGES.oversize_white;
    if (col.includes("grey") || col.includes("gray")) return COLLECTION_IMAGES.oversize_grey;
    return COLLECTION_IMAGES.oversize_black;
  }

  // Shirts / Tops / Tees
  if (name.includes("shirt") || name.includes("top") || name.includes("tee") || name.includes("t-shirt") || cat.includes("shirt")) {
    if (col.includes("white")) return COLLECTION_IMAGES.shirt_white;
    if (col.includes("blue"))  return COLLECTION_IMAGES.shirt_blue;
    return COLLECTION_IMAGES.shirt_black;
  }

  // Category keyword fallback
  for (const [key, img] of Object.entries(CATEGORY_IMAGES)) {
    if (cat.includes(key) || name.includes(key)) return img;
  }

  return DEFAULT_FALLBACK;
}

/**
 * Returns the first valid image URL from a product's images array,
 * or the best local collection fallback.
 */
export function resolveProductImage(
  images: string[] | undefined,
  productName: string,
  categoryName?: string,
  colors?: string[]
): string {
  if (images && images.length > 0 && images[0].trim() !== "") {
    return images[0];
  }
  return getProductImage(productName, categoryName, colors?.[0] ?? "");
}

/**
 * Returns a full image gallery — DB images first, then color variants from
 * local collection if no DB images exist.
 */
export function resolveProductGallery(
  images: string[] | undefined,
  productName: string,
  categoryName?: string,
  colors?: string[]
): string[] {
  if (images && images.length > 0 && images[0].trim() !== "") {
    return images;
  }

  const colorList = (colors && colors.length > 0) ? colors : ["black", "white"];
  const gallery: string[] = [];
  for (const color of colorList) {
    const img = getProductImage(productName, categoryName, color);
    if (!gallery.includes(img)) gallery.push(img);
  }
  return gallery.length > 0 ? gallery : [DEFAULT_FALLBACK];
}

/**
 * Returns a local image for a category by name/slug.
 * Used in CategoryGrid when no imageUrl is set in the DB.
 */
export function getCategoryImage(categoryName: string): string {
  const lower = (categoryName ?? "").toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  return DEFAULT_FALLBACK;
}
