import { NextResponse } from "next/server";
import {
  createCartWithLines,
  getShopifyCart,
  updateCartBuyerIdentity,
  updateCartDiscountCodes,
} from "@/lib/shopify/cart";
import { clearCartId, getCartId, setCartId } from "@/lib/shopify/cart-session";
import { isShopifyEnabled } from "@/lib/shopify/config";
import { getCustomerSession } from "@/lib/shopify/session";
import type { CartLineInput } from "@/lib/shopify/types";
import {
  validateCheckoutLines,
  validateDiscountCode,
} from "@/lib/shopify/validate";

type CheckoutBody = {
  /** Optional one-shot Buy Now lines (creates a fresh checkout cart). */
  lines?: CartLineInput[];
  discountCode?: string;
};

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as CheckoutBody;
    const discountCode = validateDiscountCode(body.discountCode);

    const session = await getCustomerSession().catch(() => null);
    const buyerIdentity = session
      ? {
          email: session.customer.email,
          customerAccessToken: session.accessToken,
        }
      : undefined;

    // Buy Now — one-shot cart, does not replace the bag cookie cart
    if (body.lines?.length) {
      validateCheckoutLines(body.lines);
      const cart = await createCartWithLines(
        body.lines,
        buyerIdentity,
        discountCode ? [discountCode] : undefined,
      );

      if (discountCode) {
        const applied = cart.discountCodes.some(
          (entry) =>
            entry.applicable &&
            entry.code.toUpperCase() === discountCode.toUpperCase(),
        );
        if (!applied) {
          return NextResponse.json(
            {
              error:
                "This discount code is invalid or does not apply to your bag",
            },
            { status: 400 },
          );
        }
      }

      return NextResponse.json({
        cartId: cart.id,
        checkoutUrl: cart.checkoutUrl,
        totalQuantity: cart.totalQuantity,
        customerEmail: session?.customer.email ?? null,
      });
    }

    // Bag checkout — use Shopify cart from cookie
    let cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
    }

    let cart = await getShopifyCart(cartId);
    if (!cart || cart.lines.length === 0) {
      await clearCartId();
      return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
    }

    if (buyerIdentity) {
      cart = await updateCartBuyerIdentity(cartId, buyerIdentity);
    }

    if (discountCode) {
      cart = await updateCartDiscountCodes(cartId, [discountCode]);
      const applied = cart.discountCodes.some(
        (entry) =>
          entry.applicable &&
          entry.code.toUpperCase() === discountCode.toUpperCase(),
      );
      if (!applied) {
        return NextResponse.json(
          {
            error:
              "This discount code is invalid or does not apply to your bag",
          },
          { status: 400 },
        );
      }
    }

    await setCartId(cart.id);

    return NextResponse.json({
      cartId: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
      customerEmail: session?.customer.email ?? null,
      discountTotal: cart.discountTotal,
      totalAmount: cart.totalAmount,
      appliedDiscountCodes: cart.appliedDiscountCodes,
    });
  } catch (error) {
    console.error("[api/checkout]", error);
    if (error instanceof Error && error.message.startsWith("Invalid")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
