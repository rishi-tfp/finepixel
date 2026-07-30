/** Server-only: credentials must be set on the host (never NEXT_PUBLIC_* tokens). */
export function isShopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

/** Server routes: Shopify flag + credentials present. */
export function isShopifyEnabled() {
  return (
    process.env.NEXT_PUBLIC_SHOPIFY_ENABLED === "true" && isShopifyConfigured()
  );
}

/** Client-safe catalog toggle (inlined at build time). */
export function isShopifyCatalogMode() {
  return process.env.NEXT_PUBLIC_SHOPIFY_ENABLED === "true";
}

export function getShopifyConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-01";

  if (!storeDomain || !accessToken) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN (server-only env vars)",
    );
  }

  return { storeDomain, accessToken, apiVersion };
}
