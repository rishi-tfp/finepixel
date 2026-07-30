import type { CartLineInput } from "@/lib/shopify/types";

const VARIANT_GID = /^gid:\/\/shopify\/ProductVariant\/\d+$/;

export function isValidVariantId(variantId: string) {
  return VARIANT_GID.test(variantId);
}

function validateAttributes(attributes: CartLineInput["attributes"]) {
  if (attributes == null) return;
  if (!Array.isArray(attributes) || attributes.length > 20) {
    throw new Error("Invalid line attributes");
  }
  for (const attr of attributes) {
    if (
      typeof attr?.key !== "string" ||
      typeof attr?.value !== "string" ||
      !attr.key.trim() ||
      attr.key.length > 40 ||
      attr.value.length > 120
    ) {
      throw new Error("Invalid line attribute");
    }
  }
}

export function validateCheckoutLines(lines: CartLineInput[]) {
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 20) {
    throw new Error("Invalid checkout lines");
  }

  for (const line of lines) {
    if (!line?.merchandiseId || !isValidVariantId(line.merchandiseId)) {
      throw new Error("Invalid variant id");
    }
    if (
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 10
    ) {
      throw new Error("Invalid quantity");
    }
    validateAttributes(line.attributes);
  }
}

const DISCOUNT_CODE = /^[A-Za-z0-9_-]{1,40}$/;

export function validateDiscountCode(code: unknown): string | undefined {
  if (code == null || code === "") return undefined;
  if (typeof code !== "string") {
    throw new Error("Invalid discount code");
  }
  const trimmed = code.trim();
  if (!trimmed) return undefined;
  if (!DISCOUNT_CODE.test(trimmed)) {
    throw new Error("Invalid discount code");
  }
  return trimmed.toUpperCase();
}
