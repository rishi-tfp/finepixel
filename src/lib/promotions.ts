/**
 * Welcome offer popup + promo bar copy.
 * Create the matching discount code in Shopify Admin — Bag Apply verifies via Storefront API.
 */
export const WELCOME_OFFER = {
  enabled: true,
  eyebrow: "First Visit Exclusive",
  title: "A Little Welcome Gift",
  description:
    "Celebrate your first visit with 30% OFF on any 3 notebooks. Mix, match, and make them yours.",
  ctaLabel: "Claim Offer",
  ctaHref: "/collections",
  discountCode: "WELCOME30",
} as const;

export const PROMOTION_MESSAGES = [
  "30% off any 3 notebooks — code WELCOME30",
  "Personalized notebooks, made to order",
  "Shipping only in India",
] as const;
