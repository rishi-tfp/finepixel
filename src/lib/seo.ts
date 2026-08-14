import type { CatalogProduct } from "@/lib/shopify/mappers";

/** Canonical public site URL (no trailing slash). */
export const DEFAULT_SITE_URL = "https://www.thefinepixel.com";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim() ||
    DEFAULT_SITE_URL;
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, "");
}

function absoluteUrl(pathOrUrl: string, siteUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function productJsonLd(
  product: CatalogProduct,
  siteUrl = getSiteUrl(),
) {
  const productUrl = `${siteUrl}/products/${product.handle}`;
  const images = (product.images.length ? product.images : [product.image])
    .filter(Boolean)
    .map((src) => absoluteUrl(src, siteUrl));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: images.length ? images : undefined,
    sku: product.handle,
    productID: product.shopifyId ?? product.id,
    category: product.category ?? product.edition,
    brand: {
      "@type": "Brand",
      name: "The Fine Pixel",
    },
    url: productUrl,
    ...(product.publishedAt ? { datePublished: product.publishedAt } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: product.currencyCode || "INR",
      price: product.priceAmount,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/** Specs derived from catalog data — never invent GSM/binding defaults. */
export function productSpecRows(
  product: CatalogProduct,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  for (const option of product.options) {
    if (!option.values.length) continue;
    const name = option.name.trim();
    if (!name || /^title$/i.test(name)) continue;
    rows.push({ label: name, value: option.values.join(" / ") });
  }

  const hasBindingOption = product.options.some((option) =>
    /bound|binding/i.test(option.name),
  );

  // Don't invent Binding when Shopify already has Bound Type / Binding options.
  if (!hasBindingOption) {
    if (product.edition === "hardcover") {
      rows.push({ label: "Binding", value: "Hardcover" });
    } else if (product.edition === "softcover") {
      rows.push({ label: "Binding", value: "Softcover" });
    }
  }

  if (
    product.detail &&
    !/^(notebooks?|journals?|default title)$/i.test(product.detail.trim())
  ) {
    const already = rows.some(
      (row) => row.value.toLowerCase() === product.detail!.toLowerCase(),
    );
    if (!already) {
      rows.push({ label: "Type", value: product.detail });
    }
  }

  return rows;
}
