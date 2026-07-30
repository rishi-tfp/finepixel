import { cookies } from "next/headers";
import {
  shopifyCustomerLogout,
  shopifyCustomerRenew,
  shopifyGetCustomer,
  type ShopifyCustomer,
} from "@/lib/shopify/customer";

export const CUSTOMER_COOKIE = "tfp_customer_session";

type SessionPayload = {
  accessToken: string;
  expiresAt: string;
};

export type CustomerSession = {
  accessToken: string;
  expiresAt: string;
  customer: ShopifyCustomer;
};

function cookieOptions(expiresAt: string) {
  const expires = new Date(expiresAt);
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}

export async function setCustomerSession(token: {
  accessToken: string;
  expiresAt: string;
}) {
  const store = await cookies();
  const payload: SessionPayload = {
    accessToken: token.accessToken,
    expiresAt: token.expiresAt,
  };
  store.set(CUSTOMER_COOKIE, JSON.stringify(payload), cookieOptions(token.expiresAt));
}

export async function clearCustomerSession() {
  const store = await cookies();
  const raw = store.get(CUSTOMER_COOKIE)?.value;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SessionPayload;
      if (parsed.accessToken) {
        await shopifyCustomerLogout(parsed.accessToken);
      }
    } catch {
      /* ignore */
    }
  }
  store.set(CUSTOMER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function getCustomerAccessToken(): Promise<string | null> {
  const session = await getCustomerSession();
  return session?.accessToken ?? null;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const raw = store.get(CUSTOMER_COOKIE)?.value;
  if (!raw) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(raw) as SessionPayload;
  } catch {
    return null;
  }

  if (!payload.accessToken || !payload.expiresAt) return null;

  let accessToken = payload.accessToken;
  let expiresAt = payload.expiresAt;
  const expiresMs = new Date(expiresAt).getTime();

  // Renew if expiring within 24 hours
  if (Number.isFinite(expiresMs) && expiresMs - Date.now() < 24 * 60 * 60 * 1000) {
    const renewed = await shopifyCustomerRenew(accessToken).catch(() => null);
    if (renewed) {
      accessToken = renewed.accessToken;
      expiresAt = renewed.expiresAt;
      await setCustomerSession(renewed);
    } else if (expiresMs <= Date.now()) {
      await clearCustomerSession();
      return null;
    }
  }

  const customer = await shopifyGetCustomer(accessToken).catch(() => null);
  if (!customer?.id || !customer.email) {
    await clearCustomerSession();
    return null;
  }

  return { accessToken, expiresAt, customer };
}
