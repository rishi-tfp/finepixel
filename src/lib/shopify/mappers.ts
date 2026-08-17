import type { ShopifyProductNode } from "@/lib/shopify/types";

export type ProductOption = {
  name: string;
  values: string[];
};

export type EditionKey =
  | "hardcover"
  | "softcover"
  | "special"
  | "accessories";

export type CatalogProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
  currencyCode: string;
  /** Formatted MRP when higher than selling price. */
  compareAtPrice?: string;
  compareAtPriceAmount?: number;
  image: string;
  images: string[];
  detail?: string;
  badge?: string;
  category?: string;
  tags: string[];
  edition: EditionKey;
  publishedAt?: string;
  available: boolean;
  defaultVariantId?: string;
  options: ProductOption[];
  variants: {
    id: string;
    title: string;
    available: boolean;
    price: string;
    priceAmount: number;
    compareAtPrice?: string;
    compareAtPriceAmount?: number;
    options: { name: string; value: string }[];
  }[];
  source: "local" | "shopify";
  shopifyId?: string;
};

function formatMoney(amount: string | number, currencyCode = "INR") {
  const value = typeof amount === "string" ? Number(amount) : amount;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  } catch {
    return `₹${Number.isFinite(value) ? value.toFixed(2) : "0.00"}`;
  }
}

/** Only surface compare-at when it is strictly higher than the selling price. */
export function mapCompareAt(
  raw: { amount: string; currencyCode?: string } | null | undefined,
  sellingAmount: number,
  currency: string,
): { compareAtPrice?: string; compareAtPriceAmount?: number } {
  if (!raw?.amount) return {};
  const compareAmount = Number(raw.amount);
  if (!Number.isFinite(compareAmount) || compareAmount <= sellingAmount) {
    return {};
  }
  return {
    compareAtPrice: formatMoney(
      compareAmount,
      raw.currencyCode ?? currency,
    ),
    compareAtPriceAmount: compareAmount,
  };
}

/** Shopify always includes a default Title option — hide it when there are no real choices. */
export function mapShopifyOptions(
  options: ShopifyProductNode["options"],
): ProductOption[] {
  return (options ?? []).filter((option) => {
    const isDefaultTitle =
      option.name.toLowerCase() === "title" &&
      option.values.length === 1 &&
      option.values[0].toLowerCase() === "default title";
    return !isDefaultTitle && option.values.length > 0;
  });
}

/**
 * Maps Shopify tags / product type / title → collection tab.
 * Prefer these tags in Shopify Admin:
 * hardcover | softcover | spiral | special | limited-edition | accessories
 */
export function resolveEdition(input: {
  tags?: string[];
  productType?: string;
  title?: string;
  category?: string;
}): EditionKey {
  const haystack = [
    ...(input.tags ?? []),
    input.productType ?? "",
    input.category ?? "",
    input.title ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (/\b(accessor(?:y|ies)|pen|pencil|desk-trio|graphite)\b/.test(haystack)) {
    return "accessories";
  }
  if (
    /\b(special|special-edition|limited|limited-edition|celestial|nocturne)\b/.test(
      haystack,
    )
  ) {
    return "special";
  }
  // Prefer spiral/softcover before hardcover — catalogs often tag both.
  if (
    /\b(spiral|softcover|soft-cover|soft cover|paperback|journal)\b/.test(
      haystack,
    )
  ) {
    return "softcover";
  }
  if (/\b(hardcover|hard-cover|hard cover|hardbound)\b/.test(haystack)) {
    return "hardcover";
  }

  return "softcover";
}

const EDITION_LABEL: Record<EditionKey, string> = {
  hardcover: "Hardcover",
  softcover: "Softcover",
  special: "Special Edition",
  accessories: "Accessories",
};

/** Subtitle under product photos — never Softcover / Hardcover. */
export function productCardSubtitle(
  product: Pick<CatalogProduct, "detail" | "category" | "tags">,
): string | undefined {
  const line = product.detail ?? product.category;
  if (!line || /^(notebooks?|journals?)$/i.test(line)) return undefined;
  if (
    /\b(hardcover|softcover|spiral|hard-?bound|soft-?bound)\b/i.test(line) ||
    /^(hard|soft)\s*cover$/i.test(line.trim())
  ) {
    return undefined;
  }
  if (
    Object.values(EDITION_LABEL).some(
      (label) => label.toLowerCase() === line.toLowerCase(),
    )
  ) {
    return undefined;
  }
  if (product.tags.some((t) => t.toLowerCase() === line.toLowerCase())) {
    return undefined;
  }
  return line;
}

/** Only intentional merchandising badges — never raw Shopify tags like "cute". */
export function resolveBadge(tags: string[] = []): string | undefined {
  const joined = tags.join(" ");
  if (/best[-_\s]?sellers?/i.test(joined)) return "Bestseller";
  if (/limited[-_\s]?edition/i.test(joined) || /\blimited\b/i.test(joined)) {
    return "Limited Edition";
  }
  if (/new[-_\s]?release|\bnew\b/i.test(joined)) return "New Release";
  if (/artisan/i.test(joined)) return "Artisan Crafted";
  return undefined;
}

function resolveDetail(productType: string | undefined, _edition: EditionKey) {
  const type = productType?.trim();
  if (
    type &&
    !/^(notebooks?|journals?)$/i.test(type) &&
    !/^(hard|soft)\s*cover$/i.test(type) &&
    !/\b(hardcover|softcover|spiral|hard-?bound|soft-?bound)\b/i.test(type)
  ) {
    return type;
  }
  // Never invent Softcover / Hardcover for card subtitles — Bound Type is a
  // Shopify option when it matters.
  return undefined;
}

export function mapShopifyProduct(node: ShopifyProductNode): CatalogProduct {
  const tags = node.tags ?? [];
  const rangeCurrency =
    node.priceRange.minVariantPrice.currencyCode ?? "INR";

  const variants =
    node.variants?.edges?.map((edge) => edge.node).map((variant) => {
      const currency =
        variant.price?.currencyCode ?? rangeCurrency;
      const priceAmount = Number(
        variant.price?.amount ?? node.priceRange.minVariantPrice.amount,
      );
      // Only this variant's Compare-at — never a product-wide range max.
      const compareAt = mapCompareAt(
        variant.compareAtPrice,
        priceAmount,
        currency,
      );
      return {
        id: variant.id,
        title: variant.title,
        available: variant.availableForSale !== false,
        price: formatMoney(priceAmount, currency),
        priceAmount,
        ...compareAt,
        options: variant.selectedOptions ?? [],
      };
    }) ?? [];

  const images =
    node.images?.edges?.map((edge) => edge.node.url) ??
    (node.featuredImage?.url ? [node.featuredImage.url] : []);

  const defaultVariant =
    variants.find((variant) => variant.available) ?? variants[0];

  const amount =
    defaultVariant?.priceAmount ??
    Number(node.priceRange.minVariantPrice.amount);
  const currency = rangeCurrency;

  const edition = resolveEdition({
    tags,
    productType: node.productType,
    title: node.title,
  });
  const detail = resolveDetail(node.productType, edition);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? "",
    price: formatMoney(amount, currency),
    priceAmount: amount,
    currencyCode: currency,
    // Product-level MRP mirrors the default variant only (no range fallback).
    ...(defaultVariant?.compareAtPriceAmount != null
      ? {
          compareAtPrice: defaultVariant.compareAtPrice,
          compareAtPriceAmount: defaultVariant.compareAtPriceAmount,
        }
      : {}),
    image: images[0] ?? "",
    images,
    detail,
    badge: resolveBadge(tags),
    category: detail,
    tags,
    edition,
    publishedAt: node.publishedAt ?? undefined,
    available: variants.some((variant) => variant.available),
    defaultVariantId: defaultVariant?.id,
    options: mapShopifyOptions(node.options),
    variants,
    source: "shopify",
    shopifyId: node.id,
  };
}

export function resolveVariantId(
  product: CatalogProduct,
  optionValues?: Record<string, string>,
) {
  if (!optionValues || Object.keys(optionValues).length === 0) {
    return product.defaultVariantId;
  }

  const match = product.variants.find((variant) =>
    Object.entries(optionValues).every(([name, value]) =>
      variant.options.some(
        (option) =>
          option.name.toLowerCase() === name.toLowerCase() &&
          option.value.toLowerCase() === value.toLowerCase(),
      ),
    ),
  );

  return match?.id ?? product.defaultVariantId;
}
