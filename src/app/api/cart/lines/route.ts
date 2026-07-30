import { NextResponse } from "next/server";
import {
  getShopifyCart,
  removeCartLines,
  updateCartLines,
} from "@/lib/shopify/cart";
import { clearCartId, getCartId } from "@/lib/shopify/cart-session";
import { isShopifyEnabled } from "@/lib/shopify/config";

async function requireCart() {
  const cartId = await getCartId();
  if (!cartId) return { error: NextResponse.json({ error: "Cart is empty" }, { status: 400 }) };
  const cart = await getShopifyCart(cartId);
  if (!cart) {
    await clearCartId();
    return { error: NextResponse.json({ error: "Cart is empty" }, { status: 400 }) };
  }
  return { cartId, cart };
}

export async function PATCH(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Cart is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      lineId?: string;
      quantity?: number;
    };
    const lineId = body.lineId?.trim();
    const quantity = Number(body.quantity);

    if (!lineId?.startsWith("gid://shopify/")) {
      return NextResponse.json({ error: "Invalid line" }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const required = await requireCart();
    if ("error" in required && required.error) return required.error;

    const { cartId } = required as { cartId: string };
    const cart =
      quantity < 1
        ? await removeCartLines(cartId, [lineId])
        : await updateCartLines(cartId, [{ id: lineId, quantity }]);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("[api/cart/lines PATCH]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Cart is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { lineId?: string };
    const lineId = body.lineId?.trim();
    if (!lineId?.startsWith("gid://shopify/")) {
      return NextResponse.json({ error: "Invalid line" }, { status: 400 });
    }

    const required = await requireCart();
    if ("error" in required && required.error) return required.error;

    const { cartId } = required as { cartId: string };
    const cart = await removeCartLines(cartId, [lineId]);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("[api/cart/lines DELETE]", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
