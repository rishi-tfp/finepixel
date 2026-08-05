export { getProductByHandle, getProducts } from "@/lib/shopify/catalog";
export {
  addLinesToCart,
  createCart,
  createCartWithLines,
  createShopifyCart,
  getShopifyCart,
  removeCartLines,
  updateCartDiscountCodes,
  updateCartLines,
} from "@/lib/shopify/cart";
export { getShopifyClient, shopifyFetch } from "@/lib/shopify/client";
export {
  getShopifyConfig,
  isShopifyCatalogMode,
  isShopifyConfigured,
  isShopifyEnabled,
} from "@/lib/shopify/config";
export {
  mapShopifyProduct,
  resolveVariantId,
  type CatalogProduct,
} from "@/lib/shopify/mappers";
export {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
} from "@/lib/shopify/queries";
export type { CartLineInput, ShopifyProductNode } from "@/lib/shopify/types";
export { isValidVariantId, validateCheckoutLines } from "@/lib/shopify/validate";
