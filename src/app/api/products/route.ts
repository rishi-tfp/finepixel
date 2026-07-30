import { NextResponse } from "next/server";
import {
  CatalogUnavailableError,
  getAllProducts,
  getCatalogSource,
} from "@/lib/product-source";

export const revalidate = 60;

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({
      source: getCatalogSource(products),
      products,
    });
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      return NextResponse.json(
        { error: "catalog_unavailable" },
        { status: 503 },
      );
    }
    console.error("[api/products]", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 },
    );
  }
}
