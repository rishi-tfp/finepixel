import { NextResponse } from "next/server";
import {
  applyCouponCopy,
  FALLBACK_COUPONS,
  type Coupon,
} from "@/lib/coupons";
import { getShopifyCart, updateCartDiscountCodes } from "@/lib/shopify/cart";
import { getCartId } from "@/lib/shopify/cart-session";
import { isShopifyAdminConfigured, isShopifyEnabled } from "@/lib/shopify/config";
import { fetchActiveDiscountCodes } from "@/lib/shopify/discounts";

export const dynamic = "force-dynamic";

type EvaluatedCoupon = {
  code: string;
  title: string;
  requirement: string;
  eligible: boolean;
  savings: number;
};

/**
 * Shopify Admin is the source of truth for which codes exist. The hardcoded
 * list is only a stand-in for deployments without an Admin token.
 */
async function loadCatalog(): Promise<Coupon[]> {
  if (!isShopifyAdminConfigured()) return FALLBACK_COUPONS;
  try {
    const active = await fetchActiveDiscountCodes();
    return active.map((discount) =>
      applyCouponCopy(discount.code, discount.summary),
    );
  } catch (error) {
    console.error("[api/discounts/available] admin list failed", error);
    return FALLBACK_COUPONS;
  }
}

/**
 * Scores every coupon against the shopper's real cart.
 *
 * Storefront API cannot report a discount's rules, so each code is applied in
 * turn and Shopify's own numbers are recorded. The cart's original code is put
 * back before returning, which is why this must run sequentially.
 */
export async function GET() {
  if (!isShopifyEnabled()) {
    return NextResponse.json({ coupons: [], bestCode: null });
  }

  try {
    const catalog = await loadCatalog();
    if (catalog.length === 0) {
      return NextResponse.json({ coupons: [], bestCode: null });
    }

    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({
        coupons: catalog.map((coupon) => ({
          ...coupon,
          eligible: false,
          savings: 0,
        })),
        bestCode: null,
        currencyCode: "INR",
        empty: true,
      });
    }

    const original = await getShopifyCart(cartId);
    if (!original || original.lines.length === 0) {
      return NextResponse.json({
        coupons: catalog.map((coupon) => ({
          ...coupon,
          eligible: false,
          savings: 0,
        })),
        bestCode: null,
        currencyCode: original?.currencyCode ?? "INR",
        empty: true,
      });
    }

    const originalCodes = original.appliedDiscountCodes;
    const evaluated: EvaluatedCoupon[] = [];

    try {
      for (const coupon of catalog) {
        const code = coupon.code.trim().toUpperCase();
        try {
          const cart = await updateCartDiscountCodes(cartId, [code]);
          const eligible = cart.discountCodes.some(
            (entry) => entry.code.toUpperCase() === code && entry.applicable,
          );
          evaluated.push({
            ...coupon,
            eligible,
            savings: eligible ? cart.discountTotal : 0,
          });
        } catch {
          evaluated.push({ ...coupon, eligible: false, savings: 0 });
        }
      }
    } finally {
      await updateCartDiscountCodes(cartId, originalCodes).catch(() => null);
    }

    evaluated.sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.savings - a.savings;
    });

    const best = evaluated.find(
      (coupon) => coupon.eligible && coupon.savings > 0,
    );

    return NextResponse.json({
      coupons: evaluated,
      bestCode: best?.code ?? null,
      bestSavings: best?.savings ?? 0,
      currencyCode: original.currencyCode,
      appliedCode: originalCodes[0] ?? null,
    });
  } catch (error) {
    console.error("[api/discounts/available]", error);
    return NextResponse.json(
      { error: "Could not load coupons" },
      { status: 500 },
    );
  }
}
