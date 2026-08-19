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
  codes(first: 250) {
    nodes {
      code
    }
  }
`;

// DiscountCodeApp has no `summary` field — including it breaks the whole
// query for every discount type, since GraphQL errors are request-wide.
const DISCOUNT_APP_FIELDS = `
  title
  status
  codes(first: 250) {
    nodes {
      code
    }
  }
`;

const ACTIVE_DISCOUNT_CODES_QUERY = `
  query ActiveDiscountCodes($first: Int!, $after: String, $query: String) {
    discountNodes(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          discount {
            ... on DiscountCodeBasic { ${DISCOUNT_FIELDS} }
            ... on DiscountCodeBxgy { ${DISCOUNT_FIELDS} }
            ... on DiscountCodeFreeShipping { ${DISCOUNT_FIELDS} }
            ... on DiscountCodeApp { ${DISCOUNT_APP_FIELDS} }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
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
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
    };
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
): Promise<ActiveDiscount[]> {
  if (!isShopifyAdminConfigured()) return [];

  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.discounts;
  }

  const seen = new Set<string>();
  const discounts: ActiveDiscount[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  // Shopify returns at most 250 discount nodes per page. Follow the cursor so
  // every active code-based discount from Admin is surfaced on the storefront.
  while (hasNextPage) {
    const data: DiscountNodesResponse =
      await shopifyAdminFetch<DiscountNodesResponse>(
      ACTIVE_DISCOUNT_CODES_QUERY,
      { first: 250, after, query: "status:active" },
      );

    for (const edge of data.discountNodes?.edges ?? []) {
      const discount = edge.node?.discount;
      if (!discount || discount.status !== "ACTIVE") continue;

      for (const entry of discount.codes?.nodes ?? []) {
        const code = entry.code?.trim().toUpperCase();
        if (!code || seen.has(code)) continue;
        seen.add(code);

        discounts.push({
          code,
          title: discount.title?.trim() || code,
          summary: discount.summary?.trim() || "",
        });
      }
    }

    const pageInfo: NonNullable<
      DiscountNodesResponse["discountNodes"]
    >["pageInfo"] =
      data.discountNodes?.pageInfo;
    hasNextPage = pageInfo?.hasNextPage === true && Boolean(pageInfo.endCursor);
    after = pageInfo?.endCursor ?? null;
  }

  cache = { at: Date.now(), discounts };
  return discounts;
}

export function clearActiveDiscountCache() {
  cache = null;
}
