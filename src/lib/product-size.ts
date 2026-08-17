import type { CatalogProduct } from "@/lib/shopify/mappers";

export type SizeKey = "a4" | "a5" | "a6";

export const SIZE_OPTIONS: { id: SizeKey; label: string; match: RegExp }[] = [
  { id: "a4", label: "A4", match: /\ba4\b/i },
  { id: "a5", label: "A5 (148 × 210 mm)", match: /\ba5\b/i },
  { id: "a6", label: "A6 (105 × 148 mm)", match: /\ba6\b/i },
];

export function parseSizeKey(value: string | null | undefined): SizeKey | null {
  if (value === "a4" || value === "a5" || value === "a6") return value;
  return null;
}

function sizeMatcher(size: SizeKey) {
  return SIZE_OPTIONS.find((item) => item.id === size)?.match;
}

export function productTextMatchesSize(product: CatalogProduct, size: SizeKey) {
  const match = sizeMatcher(size);
  if (!match) return false;
  const haystack = [
    product.title,
    product.description,
    product.detail,
    product.category,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  return match.test(haystack);
}

export function variantMatchesSize(
  variant: CatalogProduct["variants"][number],
  size: SizeKey,
) {
  const match = sizeMatcher(size);
  if (!match) return false;
  return (
    match.test(variant.title) ||
    variant.options.some((option) => match.test(option.value))
  );
}

export function variantForSize(product: CatalogProduct, size: SizeKey) {
  return (
    product.variants.find(
      (variant) => variant.available && variantMatchesSize(variant, size),
    ) ?? product.variants.find((variant) => variantMatchesSize(variant, size))
  );
}

export function productHasSizeVariants(product: CatalogProduct) {
  return SIZE_OPTIONS.some((size) =>
    product.variants.some((variant) => variantMatchesSize(variant, size.id)),
  );
}

export function productMatchesSize(
  product: CatalogProduct,
  size: SizeKey | null,
) {
  if (!size) return true;
  if (variantForSize(product, size)) return true;
  if (productHasSizeVariants(product)) return false;
  return productTextMatchesSize(product, size);
}

export function displayedVariant(
  product: CatalogProduct,
  size: SizeKey | null,
) {
  return size ? variantForSize(product, size) : undefined;
}

export function productHref(handle: string, size: SizeKey | null) {
  return size ? `/products/${handle}?size=${size}` : `/products/${handle}`;
}

export function applySizeToSelections(
  product: CatalogProduct,
  selections: Record<string, string>,
  size: SizeKey | null,
) {
  if (!size) return selections;
  const match = sizeMatcher(size);
  if (!match) return selections;
  const next = { ...selections };
  for (const option of product.options) {
    const value = option.values.find((item) => match.test(item));
    if (value) next[option.name] = value;
  }
  return next;
}
