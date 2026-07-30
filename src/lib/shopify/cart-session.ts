import { cookies } from "next/headers";

export const CART_COOKIE = "tfp_shopify_cart_id";

const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function getCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function setCartId(cartId: string) {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

export async function clearCartId() {
  const store = await cookies();
  store.set(CART_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}
