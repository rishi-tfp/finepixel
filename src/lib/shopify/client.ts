import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { getShopifyConfig } from "@/lib/shopify/config";

let client: ReturnType<typeof createStorefrontApiClient> | null = null;

export function getShopifyClient() {
  if (!client) {
    const { storeDomain, accessToken, apiVersion } = getShopifyConfig();
    client = createStorefrontApiClient({
      storeDomain,
      apiVersion,
      publicAccessToken: accessToken,
    });
  }
  return client;
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const response = await getShopifyClient().request(query, { variables });
  if (response.errors) {
    const message =
      typeof response.errors === "string"
        ? response.errors
        : JSON.stringify(response.errors);
    throw new Error(message);
  }
  return response.data as T;
}
