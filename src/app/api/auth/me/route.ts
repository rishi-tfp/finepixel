import { NextResponse } from "next/server";
import { isShopifyEnabled } from "@/lib/shopify/config";
import { getCustomerSession } from "@/lib/shopify/session";

export async function GET() {
  if (!isShopifyEnabled()) {
    return NextResponse.json({ customer: null, enabled: false });
  }

  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ customer: null, enabled: true });
    }

    return NextResponse.json({
      enabled: true,
      customer: {
        id: session.customer.id,
        email: session.customer.email,
        firstName: session.customer.firstName,
        lastName: session.customer.lastName,
        phone: session.customer.phone,
        defaultAddress: session.customer.defaultAddress,
      },
    });
  } catch (error) {
    console.error("[api/auth/me]", error);
    return NextResponse.json({ customer: null, enabled: true });
  }
}
