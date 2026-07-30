import {
  getLocalProduct,
  getLocalProducts,
  localProducts,
} from "@/lib/products";
import { getProductByHandle, getProducts } from "@/lib/shopify/catalog";
import { isShopifyCatalogMode } from "@/lib/shopify/config";
import {
  mapShopifyProduct,
  type CatalogProduct,
} from "@/lib/shopify/mappers";

export type { CatalogProduct };

export { isShopifyCatalogMode };

export class CatalogUnavailableError extends Error {
  constructor(message = "Catalog is temporarily unavailable") {
    super(message);
    this.name = "CatalogUnavailableError";
  }
}

async function fetchShopifyCatalog(): Promise<CatalogProduct[]> {
  const nodes = await getProducts();
  return nodes.map(mapShopifyProduct);
}

/**
 * When Shopify mode is on, never fall back to local demo products —
 * those cannot be purchased and confuse a live storefront.
 */
export async function getAllProducts(): Promise<CatalogProduct[]> {
  if (!isShopifyCatalogMode()) return getLocalProducts();

  try {
    return await fetchShopifyCatalog();
  } catch (error) {
    console.error("[shopify] catalog fetch failed:", error);
    throw new CatalogUnavailableError();
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<CatalogProduct | null> {
  if (isShopifyCatalogMode()) {
    try {
      const node = await getProductByHandle(slug);
      if (!node) return null;
      return mapShopifyProduct(node);
    } catch (error) {
      console.error(`[shopify] product "${slug}" fetch failed:`, error);
      throw new CatalogUnavailableError();
    }
  }

  return getLocalProduct(slug) ?? null;
}

export function isShopifyProduct(product: CatalogProduct) {
  return product.source === "shopify" && Boolean(product.shopifyId);
}

export function getCatalogSource(catalog: CatalogProduct[]) {
  if (!isShopifyCatalogMode()) return "local" as const;
  if (catalog.length > 0 && isShopifyProduct(catalog[0])) return "shopify" as const;
  return "shopify" as const;
}

export { localProducts };
