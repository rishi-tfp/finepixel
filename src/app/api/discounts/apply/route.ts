import { NextResponse } from "next/server";
import {
  getShopifyCart,
  updateCartDiscountCodes,
} from "@/lib/shopify/cart";
import { clearCartId, getCartId } from "@/lib/shopify/cart-session";
import { isShopifyEnabled } from "@/lib/shopify/config";
import { validateDiscountCode } from "@/lib/shopify/validate";

type DiscountBody = {
  discountCode?: string;
};

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Discounts are temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as DiscountBody;
    const discountCode = validateDiscountCode(body.discountCode);

    if (!discountCode) {
      return NextResponse.json(
        { error: "Enter a discount code" },
        { status: 400 },
      );
    }

    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json(
        { error: "Add products to your bag first" },
        { status: 400 },
      );
    }

    const existing = await getShopifyCart(cartId);
    if (!existing || existing.lines.length === 0) {
      await clearCartId();
      return NextResponse.json(
        { error: "Add products to your bag first" },
        { status: 400 },
      );
    }

    const cart = await updateCartDiscountCodes(cartId, [discountCode]);
    const matched = cart.discountCodes.find(
      (entry) => entry.code.toUpperCase() === discountCode,
    );
    const applicable = matched?.applicable === true;

    if (!applicable) {
      // Clear invalid code from cart
      await updateCartDiscountCodes(cartId, []).catch(() => null);
      return NextResponse.json({
        ok: false,
        applicable: false,
        code: discountCode,
        error: "This code is invalid or does not apply to your bag",
        subtotalAmount: existing.subtotalAmount,
        totalAmount: existing.totalAmount,
        discountTotal: 0,
        currencyCode: existing.currencyCode,
        lines: existing.lines,
      });
    }

    return NextResponse.json({
      ok: true,
      applicable: true,
      code: discountCode,
      subtotalAmount: cart.subtotalAmount,
      totalAmount: cart.totalAmount,
      discountTotal: cart.discountTotal,
      currencyCode: cart.currencyCode,
      appliedDiscountCodes: cart.appliedDiscountCodes,
      lines: cart.lines,
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
    });
  } catch (error) {
    console.error("[api/discounts/apply]", error);
    if (error instanceof Error && error.message.startsWith("Invalid")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Could not apply discount code" },
      { status: 500 },
    );
  }
}

/** Clear discount codes from the bag cart. */
export async function DELETE() {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Discounts are temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({
        ok: true,
        discountTotal: 0,
        totalAmount: 0,
        subtotalAmount: 0,
        currencyCode: "INR",
        lines: [],
      });
    }

    const existing = await getShopifyCart(cartId);
    if (!existing) {
      await clearCartId();
      return NextResponse.json({
        ok: true,
        discountTotal: 0,
        totalAmount: 0,
        subtotalAmount: 0,
        currencyCode: "INR",
        lines: [],
      });
    }

    const cart = await updateCartDiscountCodes(cartId, []);
    return NextResponse.json({
      ok: true,
      subtotalAmount: cart.subtotalAmount,
      totalAmount: cart.totalAmount,
      discountTotal: cart.discountTotal,
      currencyCode: cart.currencyCode,
      appliedDiscountCodes: cart.appliedDiscountCodes,
      lines: cart.lines,
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
    });
  } catch (error) {
    console.error("[api/discounts/apply DELETE]", error);
    return NextResponse.json(
      { error: "Could not remove discount code" },
      { status: 500 },
    );
  }
}
