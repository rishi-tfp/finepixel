import { NextResponse } from "next/server";
import { isShopifyEnabled } from "@/lib/shopify/config";
import {
  shopifyCustomerLogin,
  shopifyGetCustomer,
} from "@/lib/shopify/customer";
import { setCustomerSession } from "@/lib/shopify/session";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json(
      { error: "Account login is temporarily unavailable" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as LoginBody;
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const token = await shopifyCustomerLogin(email, password);
    await setCustomerSession(token);
    const customer = await shopifyGetCustomer(token.accessToken);

    if (!customer) {
      return NextResponse.json(
        { error: "Could not load customer profile" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        defaultAddress: customer.defaultAddress,
      },
    });
  } catch (error) {
    console.error("[api/auth/login]", error);
    const message =
      error instanceof Error ? error.message : "Invalid email or password";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
