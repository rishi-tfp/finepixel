import { getShopifyAdminConfig } from "@/lib/shopify/config";

/**
 * Admin GraphQL request. Kept separate from the Storefront client because the
 * Admin token is privileged and must never reach the browser.
 */
export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const { storeDomain, adminAccessToken, apiVersion } = getShopifyAdminConfig();

  const response = await fetch(
    `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify Admin API responded ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: unknown;
  };

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  if (!json.data) {
    throw new Error("Shopify Admin API returned no data");
  }

  return json.data;
}
