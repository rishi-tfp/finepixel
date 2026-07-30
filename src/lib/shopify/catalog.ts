import { shopifyFetch } from "@/lib/shopify/client";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from "@/lib/shopify/queries";
import type { ShopifyProductNode } from "@/lib/shopify/types";

type ProductsResponse = {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    edges: { node: ShopifyProductNode }[];
  };
};

type ProductResponse = {
  product: ShopifyProductNode | null;
};

export async function getProducts(limit = 250): Promise<ShopifyProductNode[]> {
  const catalog: ShopifyProductNode[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage && catalog.length < limit) {
    const page: ProductsResponse = await shopifyFetch<ProductsResponse>(
      PRODUCTS_QUERY,
      {
        first: Math.min(50, limit - catalog.length),
        after,
      },
    );

    for (const edge of page.products.edges) {
      catalog.push(edge.node);
    }

    hasNextPage = page.products.pageInfo.hasNextPage;
    after = page.products.pageInfo.endCursor;
  }

  return catalog;
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProductNode | null> {
  const data = await shopifyFetch<ProductResponse>(PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });
  return data.product;
}
