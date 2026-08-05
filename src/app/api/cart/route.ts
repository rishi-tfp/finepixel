import { NextResponse } from "next/server";
import {
  addLinesToCart,
  createShopifyCart,
  getShopifyCart,
  type ShopifyCartResult,
} from "@/lib/shopify/cart";
import { clearCartId, getCartId, setCartId } from "@/lib/shopify/cart-session";
import { isShopifyEnabled } from "@/lib/shopify/config";
import type { CartLineInput } from "@/lib/shopify/types";
import { isValidVariantId } from "@/lib/shopify/validate";

function cartResponse(cart: ShopifyCartResult) {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotalAmount: cart.subtotalAmount,
    totalAmount: cart.totalAmount,
    currencyCode: cart.currencyCode,
    discountCodes: cart.discountCodes,
    discountTotal: cart.discountTotal,
    appliedDiscountCodes: cart.appliedDiscountCodes,
    lines: cart.lines,
  };
}

export async function GET() {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Cart is temporarily unavailable", lines: [] },
      { status: 503 },
    );
  }

  try {
    const cartId = await getCartId();
    if (!cartId) {
      return NextResponse.json({
        id: null,
        lines: [],
        totalQuantity: 0,
        subtotalAmount: 0,
        totalAmount: 0,
        currencyCode: "INR",
        checkoutUrl: null,
        discountCodes: [],
        discountTotal: 0,
        appliedDiscountCodes: [],
      });
    }

    const cart = await getShopifyCart(cartId);
    if (!cart) {
      await clearCartId();
      return NextResponse.json({
        id: null,
        lines: [],
        totalQuantity: 0,
        subtotalAmount: 0,
        totalAmount: 0,
        currencyCode: "INR",
        checkoutUrl: null,
        discountCodes: [],
        discountTotal: 0,
        appliedDiscountCodes: [],
      });
    }

    return NextResponse.json(cartResponse(cart));
  } catch (error) {
    console.error("[api/cart GET]", error);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

type AddBody = {
  merchandiseId?: string;
  quantity?: number;
  attributes?: CartLineInput["attributes"];
};

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Cart is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as AddBody;
    const merchandiseId = body.merchandiseId?.trim();
    const quantity = Number(body.quantity ?? 1);

    if (!merchandiseId || !isValidVariantId(merchandiseId)) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const line: CartLineInput = {
      merchandiseId,
      quantity,
      ...(body.attributes?.length ? { attributes: body.attributes } : {}),
    };

    let cartId = await getCartId();
    let cart: ShopifyCartResult;

    if (cartId) {
      const existing = await getShopifyCart(cartId);
      if (!existing) {
        await clearCartId();
        cartId = null;
      }
    }

    if (cartId) {
      cart = await addLinesToCart(cartId, [line]);
    } else {
      cart = await createShopifyCart([line]);
      await setCartId(cart.id);
    }

    return NextResponse.json(cartResponse(cart));
  } catch (error) {
    console.error("[api/cart POST]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
