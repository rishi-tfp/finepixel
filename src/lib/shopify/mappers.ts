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

function resolveDetail(productType: string | undefined, edition: EditionKey) {
  const type = productType?.trim();
  if (type && !/^(notebooks?|journals?)$/i.test(type)) {
    return type;
  }
  return EDITION_LABEL[edition];
}

export function mapShopifyProduct(node: ShopifyProductNode): CatalogProduct {
  const tags = node.tags ?? [];
  const variants =
    node.variants?.edges?.map((edge) => edge.node).map((variant) => ({
      id: variant.id,
      title: variant.title,
      available: variant.availableForSale !== false,
      price: formatMoney(
        variant.price?.amount ?? node.priceRange.minVariantPrice.amount,
        variant.price?.currencyCode ??
          node.priceRange.minVariantPrice.currencyCode ??
          "INR",
      ),
      options: variant.selectedOptions ?? [],
    })) ?? [];

  const images =
    node.images?.edges?.map((edge) => edge.node.url) ??
    (node.featuredImage?.url ? [node.featuredImage.url] : []);

  const currency = node.priceRange.minVariantPrice.currencyCode ?? "INR";
  const amount = Number(node.priceRange.minVariantPrice.amount);

  const defaultVariant =
    variants.find((variant) => variant.available) ?? variants[0];

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
