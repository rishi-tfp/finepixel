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

function normalizeStoreDomain(storeDomain: string) {
  return storeDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function readEnv(name: string) {
  // Dynamic lookup so Next.js cannot inline these at build time.
  // Vercel "Sensitive" vars are runtime-only and would otherwise be empty.
  return process.env[name]?.trim() || "";
}

function hasAdminClientCredentials() {
  return Boolean(
    readEnv("SHOPIFY_ADMIN_CLIENT_ID") && readEnv("SHOPIFY_ADMIN_CLIENT_SECRET"),
  );
}

/**
 * Admin API access is optional. Without it the coupon dropdown falls back to
 * the codes hardcoded in `src/lib/coupons.ts`.
 *
 * Shopify no longer issues a permanent Admin token in the admin UI. Prefer
 * Dev Dashboard client credentials; a legacy SHOPIFY_ADMIN_ACCESS_TOKEN still
 * works if one already exists.
 */
export function isShopifyAdminConfigured() {
  return Boolean(
    readEnv("SHOPIFY_STORE_DOMAIN") &&
      (readEnv("SHOPIFY_ADMIN_ACCESS_TOKEN") || hasAdminClientCredentials()),
  );
}

export function getShopifyAdminConfig() {
  const storeDomain = readEnv("SHOPIFY_STORE_DOMAIN");
  const apiVersion = readEnv("SHOPIFY_API_VERSION") || "2026-01";
  const adminAccessToken = readEnv("SHOPIFY_ADMIN_ACCESS_TOKEN") || undefined;
  const clientId = readEnv("SHOPIFY_ADMIN_CLIENT_ID") || undefined;
  const clientSecret = readEnv("SHOPIFY_ADMIN_CLIENT_SECRET") || undefined;

  if (!storeDomain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN (server-only env var)");
  }
  if (!adminAccessToken && !(clientId && clientSecret)) {
    throw new Error(
      "Missing Shopify Admin credentials. Set SHOPIFY_ADMIN_CLIENT_ID and SHOPIFY_ADMIN_CLIENT_SECRET, or a legacy SHOPIFY_ADMIN_ACCESS_TOKEN.",
    );
  }

  return {
    storeDomain: normalizeStoreDomain(storeDomain),
    apiVersion,
    adminAccessToken,
    clientId,
    clientSecret,
  };
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
