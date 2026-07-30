"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/lib/shopify/mappers";
import type { CartLineAttribute } from "@/lib/shopify/types";

export type CartItem = {
  lineId: string;
  productId: string;
  handle: string;
  title: string;
  price: string;
  priceAmount: number;
  currencyCode?: string;
  image: string;
  quantity: number;
  variantId?: string;
  variantTitle?: string;
  available?: boolean;
  source: "shopify";
  detail?: string;
  attributes?: CartLineAttribute[];
};

type AddItemOptions = {
  attributes?: CartLineAttribute[];
  detail?: string;
  title?: string;
  variantTitle?: string;
};

type CartApiPayload = {
  id?: string | null;
  checkoutUrl?: string | null;
  totalQuantity?: number;
  subtotalAmount?: number;
  totalAmount?: number;
  currencyCode?: string;
  lines?: Array<{
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
    available?: boolean;
    attributes?: CartLineAttribute[];
  }>;
  error?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  currencyCode: string;
  checkoutUrl: string | null;
  hydrated: boolean;
  isMutating: boolean;
  addItem: (
    product: CatalogProduct,
    quantity?: number,
    variantId?: string,
    options?: AddItemOptions,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clear: () => void;
  checkout: (discountCode?: string) => Promise<{ ok: boolean; error?: string }>;
  isCheckingOut: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function formatMoney(amount: number, currencyCode = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

function mapApiLines(payload: CartApiPayload): CartItem[] {
  return (payload.lines ?? []).map((line) => ({
    lineId: line.lineId,
    productId: line.productId,
    handle: line.handle,
    title: line.title,
    price: line.price,
    priceAmount: line.priceAmount,
    currencyCode: line.currencyCode,
    image: line.image,
    quantity: line.quantity,
    variantId: line.variantId,
    variantTitle: line.variantTitle,
    available: line.available,
    source: "shopify" as const,
    attributes: line.attributes,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [currencyCode, setCurrencyCode] = useState("INR");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const applyPayload = useCallback((payload: CartApiPayload) => {
    setItems(mapApiLines(payload));
    setSubtotal(payload.subtotalAmount ?? 0);
    setCurrencyCode(payload.currencyCode ?? "INR");
    setCheckoutUrl(payload.checkoutUrl ?? null);
  }, []);

  const refreshCart = useCallback(async () => {
    const response = await fetch("/api/cart");
    const data = (await response.json()) as CartApiPayload;
    if (!response.ok) {
      throw new Error(data.error ?? "Failed to load cart");
    }
    applyPayload(data);
  }, [applyPayload]);

  useEffect(() => {
    // Drop legacy localStorage bag — cart lives on Shopify now
    try {
      localStorage.removeItem("tfp-cart-v2");
      localStorage.removeItem("tfp-cart-v1");
    } catch {
      /* ignore */
    }

    void refreshCart()
      .catch(() => {
        setItems([]);
        setSubtotal(0);
        setCheckoutUrl(null);
      })
      .finally(() => setHydrated(true));
  }, [refreshCart]);

  const addItem = useCallback(
    async (
      product: CatalogProduct,
      quantity = 1,
      variantId?: string,
      options?: AddItemOptions,
    ) => {
      const merchandiseId = variantId ?? product.defaultVariantId;
      if (
        product.source !== "shopify" ||
        !merchandiseId?.startsWith("gid://shopify/ProductVariant/")
      ) {
        return {
          ok: false,
          error: "This product isn’t available for online checkout yet.",
        };
      }

      setIsMutating(true);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchandiseId,
            quantity,
            ...(options?.attributes?.length
              ? { attributes: options.attributes }
              : {}),
          }),
        });
        const data = (await response.json()) as CartApiPayload;
        if (!response.ok) {
          return { ok: false, error: data.error ?? "Could not add to bag" };
        }
        applyPayload(data);
        return { ok: true };
      } catch {
        return { ok: false, error: "Could not add to bag" };
      } finally {
        setIsMutating(false);
      }
    },
    [applyPayload],
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      setIsMutating(true);
      try {
        const response = await fetch("/api/cart/lines", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineId }),
        });
        const data = (await response.json()) as CartApiPayload;
        if (response.ok) applyPayload(data);
      } finally {
        setIsMutating(false);
      }
    },
    [applyPayload],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (quantity < 1) {
        await removeItem(lineId);
        return;
      }
      setIsMutating(true);
      try {
        const response = await fetch("/api/cart/lines", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineId, quantity: Math.min(10, quantity) }),
        });
        const data = (await response.json()) as CartApiPayload;
        if (response.ok) applyPayload(data);
      } finally {
        setIsMutating(false);
      }
    },
    [applyPayload, removeItem],
  );

  const clear = useCallback(() => {
    setItems([]);
    setSubtotal(0);
    setCheckoutUrl(null);
  }, []);

  const checkout = useCallback(async (discountCode?: string) => {
    const code = discountCode?.trim();
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(code ? { discountCode: code } : {}),
      });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        return { ok: false, error: data.error ?? "Checkout failed" };
      }

      window.location.href = data.checkoutUrl;
      return { ok: true };
    } catch {
      return { ok: false, error: "Checkout failed" };
    } finally {
      setIsCheckingOut(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      currencyCode,
      checkoutUrl,
      hydrated,
      isMutating,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      checkout,
      isCheckingOut,
    }),
    [
      items,
      subtotal,
      currencyCode,
      checkoutUrl,
      hydrated,
      isMutating,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      checkout,
      isCheckingOut,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function formatCartMoney(amount: number, currencyCode = "INR") {
  return formatMoney(amount, currencyCode);
}
