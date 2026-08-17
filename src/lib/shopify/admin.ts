import { getShopifyAdminConfig } from "@/lib/shopify/config";

type TokenCache = {
  token: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

async function fetchClientCredentialsToken(
  storeDomain: string,
  clientId: string,
  clientSecret: string,
) {
  const response = await fetch(
    `https://${storeDomain}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      cache: "no-store",
    },
  );

  const json = (await response.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  } | null;

  if (!response.ok || !json?.access_token) {
    throw new Error(
      json?.error_description ||
        json?.error ||
        `Shopify Admin token request failed (${response.status})`,
    );
  }

  const expiresInMs = Math.max(60, Number(json.expires_in) || 86_399) * 1000;
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + expiresInMs,
  };
  return tokenCache.token;
}

async function getAdminAccessToken() {
  const {
    storeDomain,
    adminAccessToken,
    clientId,
    clientSecret,
  } = getShopifyAdminConfig();

  if (adminAccessToken) return adminAccessToken;

  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  if (!clientId || !clientSecret) {
    throw new Error("Missing Shopify Admin client credentials");
  }

  return fetchClientCredentialsToken(storeDomain, clientId, clientSecret);
}

/**
 * Admin GraphQL request. Kept separate from the Storefront client because the
 * Admin token is privileged and must never reach the browser.
 */
export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
) {
  const { storeDomain, apiVersion } = getShopifyAdminConfig();
  const accessToken = await getAdminAccessToken();

  const response = await fetch(
    `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
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
