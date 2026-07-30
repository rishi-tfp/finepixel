import { NextResponse } from "next/server";
import { isShopifyEnabled } from "@/lib/shopify/config";
import {
  shopifyCustomerCreate,
  shopifyCustomerLogin,
  shopifyGetCustomer,
} from "@/lib/shopify/customer";
import { setCustomerSession } from "@/lib/shopify/session";

type RegisterBody = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Account registration is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as RegisterBody;
    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    const firstName = body.firstName?.trim() || undefined;
    const lastName = body.lastName?.trim() || undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    }
    if (password.length < 5) {
      return NextResponse.json(
        { error: "Password must be at least 5 characters" },
        { status: 400 },
      );
    }

    await shopifyCustomerCreate({
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing: false,
    });

    const token = await shopifyCustomerLogin(email, password);
    await setCustomerSession(token);
    const customer = await shopifyGetCustomer(token.accessToken);

    return NextResponse.json({
      ok: true,
      customer: customer
        ? {
            id: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone,
            defaultAddress: customer.defaultAddress,
          }
        : { email, firstName: firstName ?? null, lastName: lastName ?? null },
    });
  } catch (error) {
    console.error("[api/auth/register]", error);
    const message =
      error instanceof Error ? error.message : "Could not create account";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
