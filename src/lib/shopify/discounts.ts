import { shopifyAdminFetch } from "@/lib/shopify/admin";
import { isShopifyAdminConfigured } from "@/lib/shopify/config";

export type ActiveDiscount = {
  code: string;
  /** Shopify's merchant-facing name, usually the code itself. */
  title: string;
  /** Shopify's plain-English rules, e.g. "30% off entire order". */
  summary: string;
};

const DISCOUNT_FIELDS = `
  title
  summary
  status
  codes(first: 1) {
    nodes {
      code
    }
  }
`;

const ACTIVE_DISCOUNT_CODES_QUERY = `
  query ActiveDiscountCodes($first: Int!, $query: String) {
    discountNodes(first: $first, query: $query) {
      edges {
        node {
          id
          discount {
            ... on DiscountCodeBasic { ${DISCOUNT_FIELDS} }
            ... on DiscountCodeBxgy { ${DISCOUNT_FIELDS} }
            ... on DiscountCodeFreeShipping { ${DISCOUNT_FIELDS} }
          }
        }
      }
    }
  }
`;

type DiscountNodesResponse = {
  discountNodes?: {
    edges?: Array<{
      node?: {
        discount?: {
          title?: string;
          summary?: string;
          status?: string;
          codes?: { nodes?: Array<{ code?: string }> };
        };
      };
    }>;
  };
};

/** Discount lists change rarely; avoid an Admin call on every bag view. */
const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { at: number; discounts: ActiveDiscount[] } | null = null;

/**
 * Active code-based discounts from Shopify Admin.
 *
 * Automatic discounts are skipped — they need no code, so there is nothing for
 * a shopper to pick from a dropdown.
 */
export async function fetchActiveDiscountCodes(
  limit = 25,
): Promise<ActiveDiscount[]> {
  if (!isShopifyAdminConfigured()) return [];

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.discounts;
  }

  const data = await shopifyAdminFetch<DiscountNodesResponse>(
    ACTIVE_DISCOUNT_CODES_QUERY,
    { first: limit, query: "status:active" },
  );

  const seen = new Set<string>();
  const discounts: ActiveDiscount[] = [];

  for (const edge of data.discountNodes?.edges ?? []) {
    const discount = edge.node?.discount;
    if (!discount || discount.status !== "ACTIVE") continue;

    const code = discount.codes?.nodes?.[0]?.code?.trim().toUpperCase();
    if (!code || seen.has(code)) continue;
    seen.add(code);

    discounts.push({
      code,
      title: discount.title?.trim() || code,
      summary: discount.summary?.trim() || "",
    });
  }

  cache = { at: Date.now(), discounts };
  return discounts;
}

export function clearActiveDiscountCache() {
  cache = null;
}
