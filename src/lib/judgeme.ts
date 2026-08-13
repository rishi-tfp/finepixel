/**
 * Judge.me (verified product reviews via the Shopify app).
 *
 * Public token: Judge.me → Settings → Integrations → View API tokens
 * Shop domain must be the permanent *.myshopify.com ID Judge.me knows
 * (often `s8fmnv-wd.myshopify.com`, not a vanity rename).
 */

export type JudgemeReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  createdAt: string | null;
  verified: boolean;
  pictures: string[];
};

export type JudgemeProductReviews = {
  externalId: string;
  averageRating: number;
  reviewCount: number;
  reviews: JudgemeReview[];
};

export function getJudgemeShopDomain() {
  return (
    process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    ""
  )
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export function getJudgemePublicToken() {
  return process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN?.trim() || "";
}

export function isJudgemeEnabled() {
  return Boolean(getJudgemeShopDomain() && getJudgemePublicToken());
}

/** Shopify GID `gid://shopify/Product/123` → `123` (Judge.me external_id). */
export function shopifyProductNumericId(
  shopifyGidOrId: string | undefined | null,
): string | null {
  if (!shopifyGidOrId) return null;
  const match = shopifyGidOrId.match(/Product\/(\d+)/);
  if (match) return match[1];
  if (/^\d+$/.test(shopifyGidOrId)) return shopifyGidOrId;
  return null;
}

function widgetUrl(
  path: "preview_badge" | "product_review",
  externalId: string,
  extra?: Record<string, string>,
) {
  const params = new URLSearchParams({
    shop_domain: getJudgemeShopDomain(),
    api_token: getJudgemePublicToken(),
    external_id: externalId,
    ...extra,
  });
  return `https://judge.me/api/v1/widgets/${path}?${params.toString()}`;
}

function parseNumber(value: string | undefined, fallback = 0) {
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : fallback;
}

function extractAttr(html: string, attr: string) {
  const match = html.match(new RegExp(`${attr}=['"]([^'"]+)['"]`, "i"));
  return match?.[1];
}

const VERIFIED_STATUSES = new Set([
  "buyer",
  "confirmed-buyer",
  "verified-purchase",
  "semi-verified-purchase",
  "admin",
]);

type JudgemeApiReview = {
  id?: number | string;
  rating?: number;
  title?: string;
  body?: string;
  created_at?: string;
  verified?: string;
  reviewer?: { name?: string };
  pictures?: Array<{
    hidden?: boolean;
    urls?: { compact?: string; small?: string; huge?: string; original?: string };
  }>;
};

function mapReview(entry: JudgemeApiReview): JudgemeReview | null {
  const id = entry.id != null ? String(entry.id) : null;
  if (!id) return null;
  const rating = Math.min(5, Math.max(0, Number(entry.rating) || 0));
  const pictures = (entry.pictures ?? [])
    .filter((picture) => !picture.hidden)
    .map(
      (picture) =>
        picture.urls?.compact ||
        picture.urls?.small ||
        picture.urls?.huge ||
        picture.urls?.original ||
        "",
    )
    .filter(Boolean);

  return {
    id,
    rating,
    title: (entry.title ?? "").trim(),
    body: (entry.body ?? "").trim(),
    reviewerName: (entry.reviewer?.name ?? "Customer").trim() || "Customer",
    createdAt: entry.created_at ?? null,
    verified: VERIFIED_STATUSES.has((entry.verified ?? "").toLowerCase()),
    pictures,
  };
}

/**
 * Live Judge.me reviews for a Shopify product (public Widgets API).
 * Returns structured data so the storefront can render a branded UI.
 */
export async function fetchJudgemeProductReviews(
  externalId: string,
): Promise<JudgemeProductReviews | null> {
  if (!isJudgemeEnabled() || !/^\d+$/.test(externalId)) return null;

  try {
    const [badgeRes, reviewsRes] = await Promise.all([
      fetch(widgetUrl("preview_badge", externalId), {
        next: { revalidate: 300 },
      }),
      fetch(widgetUrl("product_review", externalId, { json_request: "true" }), {
        next: { revalidate: 300 },
      }),
    ]);

    let averageRating = 0;
    let reviewCount = 0;

    if (badgeRes.ok) {
      const badgeData = (await badgeRes.json()) as { badge?: string };
      const badgeHtml = badgeData.badge ?? "";
      averageRating = parseNumber(extractAttr(badgeHtml, "data-average-rating"));
      reviewCount = Math.round(
        parseNumber(extractAttr(badgeHtml, "data-number-of-reviews")),
      );
    }

    let reviews: JudgemeReview[] = [];
    if (reviewsRes.ok) {
      const reviewsData = (await reviewsRes.json()) as {
        reviews?: JudgemeApiReview[];
      };
      reviews = (reviewsData.reviews ?? [])
        .map(mapReview)
        .filter((review): review is JudgemeReview => Boolean(review));
      if (!reviewCount) reviewCount = reviews.length;
      if (!averageRating && reviews.length > 0) {
        averageRating =
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length;
      }
    }

    return {
      externalId,
      averageRating,
      reviewCount,
      reviews,
    };
  } catch (error) {
    console.error("[judgeme] fetch failed", error);
    return null;
  }
}
