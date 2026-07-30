import { shopifyFetch } from "@/lib/shopify/client";
import {
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
  CART_CREATE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "@/lib/shopify/queries";
import type { CartLineAttribute, CartLineInput } from "@/lib/shopify/types";

type Money = {
  amount: string;
  currencyCode: string;
};

type CartDiscountCode = {
  code: string;
  applicable: boolean;
};

type CartDiscountAllocation = {
  discountedAmount: Money;
  code?: string;
};

type CartLineNode = {
  id: string;
  quantity: number;
  attributes?: CartLineAttribute[];
  merchandise: {
    id: string;
    title?: string;
    availableForSale?: boolean;
    product: {
      id?: string;
      title: string;
      handle: string;
      featuredImage?: { url: string } | null;
    };
    price: Money;
    selectedOptions?: { name: string; value: string }[];
  };
};

type CartPayload = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost?: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  discountCodes?: CartDiscountCode[];
  discountAllocations?: CartDiscountAllocation[];
  lines?: {
    edges: { node: CartLineNode }[];
  };
};

type UserErrors = { field: string[]; message: string }[];

export type CartBuyerIdentity = {
  email?: string;
  customerAccessToken?: string;
  countryCode?: string;
};

export type ShopifyCartLine = {
  lineId: string;
  productId: string;
  handle: string;
  title: string;
  price: string;
  priceAmount: number;
  currencyCode: string;
  image: string;
  quantity: number;
  variantId: string;
  variantTitle?: string;
  available: boolean;
  attributes?: CartLineAttribute[];
};

export type ShopifyCartResult = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotalAmount: number;
  totalAmount: number;
  currencyCode: string;
  discountCodes: CartDiscountCode[];
  discountTotal: number;
  appliedDiscountCodes: string[];
  lines: ShopifyCartLine[];
};

function assertNoErrors(errors: { message: string }[], action: string) {
  if (errors.length > 0) {
    throw new Error(
      errors.map((e) => e.message).join(", ") || `Cart ${action} failed`,
    );
  }
}

function parseMoney(value?: string) {
  const amount = Number.parseFloat(value ?? "0");
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(amount: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

function variantTitleFromNode(node: CartLineNode): string | undefined {
  const options = (node.merchandise.selectedOptions ?? []).filter((option) => {
    const isDefault =
      option.name.toLowerCase() === "title" &&
      option.value.toLowerCase() === "default title";
    return !isDefault && option.value.trim().length > 0;
  });
  if (options.length > 0) {
    return options.map((option) => option.value).join(", ");
  }
  const title = node.merchandise.title?.trim();
  if (title && title.toLowerCase() !== "default title") return title;
  return undefined;
}

function mapLines(cart: CartPayload): ShopifyCartLine[] {
  return (cart.lines?.edges ?? []).map(({ node }) => {
    const currencyCode = node.merchandise.price.currencyCode || "INR";
    const priceAmount = parseMoney(node.merchandise.price.amount);
    return {
      lineId: node.id,
      productId: node.merchandise.product.id ?? node.merchandise.product.handle,
      handle: node.merchandise.product.handle,
      title: node.merchandise.product.title,
      price: formatMoney(priceAmount, currencyCode),
      priceAmount,
      currencyCode,
      image: node.merchandise.product.featuredImage?.url ?? "",
      quantity: node.quantity,
      variantId: node.merchandise.id,
      variantTitle: variantTitleFromNode(node),
      available: node.merchandise.availableForSale !== false,
      attributes: node.attributes?.length ? node.attributes : undefined,
    };
  });
}

function withCheckoutDiscount(checkoutUrl: string, discountCode?: string) {
  const code = discountCode?.trim();
  if (!code) return checkoutUrl;
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("discount", code);
    return url.toString();
  } catch {
    const join = checkoutUrl.includes("?") ? "&" : "?";
    return `${checkoutUrl}${join}discount=${encodeURIComponent(code)}`;
  }
}

function mapCart(
  cart: CartPayload,
  preferredDiscountCode?: string,
): ShopifyCartResult {
  const discountCodes = cart.discountCodes ?? [];
  const discountTotal = (cart.discountAllocations ?? []).reduce(
    (sum, allocation) => sum + parseMoney(allocation.discountedAmount.amount),
    0,
  );
  const appliedDiscountCodes = discountCodes
    .filter((entry) => entry.applicable)
    .map((entry) => entry.code);

  return {
    id: cart.id,
    checkoutUrl: withCheckoutDiscount(
      cart.checkoutUrl,
      preferredDiscountCode ?? appliedDiscountCodes[0],
    ),
    totalQuantity: cart.totalQuantity,
    subtotalAmount: parseMoney(cart.cost?.subtotalAmount.amount),
    totalAmount: parseMoney(cart.cost?.totalAmount.amount),
    currencyCode:
      cart.cost?.totalAmount.currencyCode ??
      cart.cost?.subtotalAmount.currencyCode ??
      "INR",
    discountCodes,
    discountTotal,
    appliedDiscountCodes,
    lines: mapLines(cart),
  };
}

function buyerIdentityInput(buyerIdentity?: CartBuyerIdentity) {
  if (!buyerIdentity?.customerAccessToken && !buyerIdentity?.email) {
    return undefined;
  }
  return {
    ...(buyerIdentity.email ? { email: buyerIdentity.email } : {}),
    ...(buyerIdentity.customerAccessToken
      ? { customerAccessToken: buyerIdentity.customerAccessToken }
      : {}),
    ...(buyerIdentity.countryCode
      ? { countryCode: buyerIdentity.countryCode }
      : {}),
  };
}

export async function getShopifyCart(cartId: string) {
  const data = await shopifyFetch<{ cart: CartPayload | null }>(CART_QUERY, {
    cartId,
  });
  if (!data.cart) return null;
  return mapCart(data.cart);
}

export async function createShopifyCart(
  lines: CartLineInput[] = [],
  buyerIdentity?: CartBuyerIdentity,
  discountCodes?: string[],
): Promise<ShopifyCartResult> {
  const identity = buyerIdentityInput(buyerIdentity);
  const codes = (discountCodes ?? [])
    .map((code) => code.trim())
    .filter(Boolean);

  const data = await shopifyFetch<{
    cartCreate: { cart: CartPayload | null; userErrors: UserErrors };
  }>(CART_CREATE_MUTATION, {
    input: {
      lines,
      ...(identity ? { buyerIdentity: identity } : {}),
      ...(codes.length > 0 ? { discountCodes: codes } : {}),
    },
  });
  assertNoErrors(data.cartCreate.userErrors, "create");
  if (!data.cartCreate.cart) throw new Error("Cart was not created");
  return mapCart(data.cartCreate.cart, codes[0]);
}

export async function createCart(
  variantId: string,
  quantity = 1,
  buyerIdentity?: CartBuyerIdentity,
  discountCodes?: string[],
) {
  return createShopifyCart(
    [{ merchandiseId: variantId, quantity }],
    buyerIdentity,
    discountCodes,
  );
}

export async function createCartWithLines(
  lines: CartLineInput[],
  buyerIdentity?: CartBuyerIdentity,
  discountCodes?: string[],
) {
  return createShopifyCart(lines, buyerIdentity, discountCodes);
}

export async function addLinesToCart(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: CartPayload | null; userErrors: UserErrors };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines });
  assertNoErrors(data.cartLinesAdd.userErrors, "lines add");
  if (!data.cartLinesAdd.cart) throw new Error("Cart update failed");
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
) {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: CartPayload | null; userErrors: UserErrors };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });
  assertNoErrors(data.cartLinesUpdate.userErrors, "lines update");
  if (!data.cartLinesUpdate.cart) throw new Error("Cart update failed");
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: CartPayload | null; userErrors: UserErrors };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });
  assertNoErrors(data.cartLinesRemove.userErrors, "lines remove");
  if (!data.cartLinesRemove.cart) throw new Error("Cart update failed");
  return mapCart(data.cartLinesRemove.cart);
}

export async function updateCartDiscountCodes(
  cartId: string,
  discountCodes: string[],
) {
  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: {
      cart: CartPayload | null;
      userErrors: UserErrors;
    };
  }>(CART_DISCOUNT_CODES_UPDATE_MUTATION, { cartId, discountCodes });
  assertNoErrors(data.cartDiscountCodesUpdate.userErrors, "discount update");
  if (!data.cartDiscountCodesUpdate.cart) {
    throw new Error("Cart discount update failed");
  }
  return mapCart(data.cartDiscountCodesUpdate.cart, discountCodes[0]);
}

export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: CartBuyerIdentity,
) {
  const identity = buyerIdentityInput(buyerIdentity);
  if (!identity) {
    const cart = await getShopifyCart(cartId);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }
  const data = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: CartPayload | null;
      userErrors: UserErrors;
    };
  }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    cartId,
    buyerIdentity: identity,
  });
  assertNoErrors(data.cartBuyerIdentityUpdate.userErrors, "buyer identity");
  if (!data.cartBuyerIdentityUpdate.cart) {
    throw new Error("Cart buyer update failed");
  }
  return mapCart(data.cartBuyerIdentityUpdate.cart);
}
