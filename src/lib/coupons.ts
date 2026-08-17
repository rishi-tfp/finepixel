import { WELCOME_OFFER } from "@/lib/promotions";

/**
 * Coupons shown in the bag dropdown.
 *
 * The list itself comes from Shopify Admin (active code discounts). Nothing
 * here decides eligibility or savings — those are always asked of Shopify.
 */
export type Coupon = {
  code: string;
  title: string;
  /** Shown when the coupon does not apply to the current bag. */
  requirement: string;
};

const DEFAULT_REQUIREMENT = "Not valid for the items in your bag right now.";

/**
 * Optional friendlier wording per code. Shopify's own summary is used for any
 * code missing from here, so this only exists to soften the copy.
 */
export const COUPON_COPY: Record<string, Partial<Omit<Coupon, "code">>> = {
  [WELCOME_OFFER.discountCode]: {
    title: "30% off any 3 notebooks",
    requirement: "Add any 3 notebooks to unlock this offer.",
  },
};

/** Used only when no Shopify Admin token is configured. */
export const FALLBACK_COUPONS: Coupon[] = [
  {
    code: WELCOME_OFFER.discountCode,
    title: "30% off any 3 notebooks",
    requirement: "Add any 3 notebooks to unlock this offer.",
  },
];

export function applyCouponCopy(
  code: string,
  shopifySummary: string,
): Coupon {
  const override = COUPON_COPY[code.toUpperCase()];
  return {
    code,
    title: override?.title || shopifySummary || code,
    requirement: override?.requirement || shopifySummary || DEFAULT_REQUIREMENT,
  };
}
