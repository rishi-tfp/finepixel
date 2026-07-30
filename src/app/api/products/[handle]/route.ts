import { NextResponse } from "next/server";
import {
  CatalogUnavailableError,
  getProductBySlug,
} from "@/lib/product-source";

export const revalidate = 60;

type RouteContext = { params: Promise<{ handle: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { handle } = await context.params;
    const product = await getProductBySlug(handle);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      return NextResponse.json(
        { error: "catalog_unavailable" },
        { status: 503 },
      );
    }
    console.error("[api/products/handle]", error);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 },
    );
  }
}
