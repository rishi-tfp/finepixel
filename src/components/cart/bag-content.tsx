"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  formatCartMoney,
  useCart,
} from "@/components/cart/cart-provider";
import { CouponPicker } from "@/components/cart/coupon-picker";
import { MaterialIcon } from "@/components/shared/material-icon";
import { WELCOME_OFFER } from "@/lib/promotions";

type AppliedDiscount = {
  code: string;
  discountTotal: number;
  totalAmount: number;
  currencyCode: string;
};

export function BagContent() {
  const router = useRouter();
  const {
    items,
    count,
    subtotal,
    currencyCode,
    hydrated,
    updateQuantity,
    removeItem,
    isCheckingOut,
  } = useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscount | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Clear Shopify-applied code when bag contents change (eligibility may change).
  useEffect(() => {
    setAppliedDiscount(null);
    setDiscountError(null);
  }, [items]);

  const cartSignature = useMemo(
    () =>
      items
        .map((item) => `${item.variantId ?? item.productId}:${item.quantity}`)
        .join("|"),
    [items],
  );

  const handleApplyDiscount = async (codeOverride?: string) => {
    setDiscountError(null);
    setCheckoutError(null);
    const code = (codeOverride ?? discountInput).trim().toUpperCase();
    if (codeOverride) setDiscountInput(code);
    if (!code) {
      setDiscountError("Enter a coupon code");
      return;
    }
    if (items.length === 0) {
      setDiscountError("Add products to your bag to apply a code");
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const response = await fetch("/api/discounts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountCode: code }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        applicable?: boolean;
        code?: string;
        error?: string;
        discountTotal?: number;
        totalAmount?: number;
        currencyCode?: string;
        subtotalAmount?: number;
      };

      if (!response.ok) {
        setAppliedDiscount(null);
        setDiscountError(data.error ?? "Could not apply coupon");
        return;
      }

      if (!data.applicable || !data.code) {
        setAppliedDiscount(null);
        setDiscountError(
          data.error ?? "This code is invalid or does not apply to your bag",
        );
        return;
      }

      setAppliedDiscount({
        code: data.code,
        discountTotal: data.discountTotal ?? 0,
        totalAmount: data.totalAmount ?? subtotal,
        currencyCode: data.currencyCode ?? currencyCode,
      });
      setDiscountInput(data.code);
      setDiscountError(null);
    } catch {
      setAppliedDiscount(null);
      setDiscountError("Could not apply coupon");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async () => {
    setDiscountError(null);
    setIsApplyingDiscount(true);
    try {
      await fetch("/api/discounts/apply", { method: "DELETE" });
    } catch {
      /* still clear local UI */
    } finally {
      setAppliedDiscount(null);
      setDiscountInput("");
      setIsApplyingDiscount(false);
    }
  };

  const handleCheckout = () => {
    setCheckoutError(null);
    const code = (appliedDiscount?.code || discountInput).trim();
    const href = code
      ? `/checkout?discount=${encodeURIComponent(code)}`
      : "/checkout";
    router.push(href);
  };

  if (!hydrated) {
    return (
      <div className="py-20 text-center font-body-md text-on-surface-variant">
        Loading bag…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <MaterialIcon name="shopping_bag" className="mb-6 text-4xl" />
        <h1 className="mb-3 font-headline-lg text-headline-lg text-primary">
          Your bag is empty
        </h1>
        <p className="mb-8 font-body-md text-on-surface-variant">
          Discover notebooks from the curated collection.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-label-md text-on-primary"
        >
          Explore Collections
          <MaterialIcon name="arrow_forward" className="text-base" />
        </Link>
      </div>
    );
  }

  const displayCurrency = appliedDiscount?.currencyCode ?? currencyCode;
  const displayTotal = appliedDiscount
    ? appliedDiscount.totalAmount
    : subtotal;
  const unavailableItems = items.filter((item) => item.available === false);

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="min-w-0 lg:col-span-7">
        <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">
          Your Bag
        </h1>
        <p className="mb-8 font-body-md text-on-surface-variant">
          {count} {count === 1 ? "item" : "items"}
        </p>

        {unavailableItems.length > 0 ? (
          <div className="mb-6 rounded-lg border border-error/30 bg-error-container/40 px-4 py-3 font-caption text-on-error-container">
            Some items are no longer available. Remove them before checkout, or
            choose another product.
          </div>
        ) : null}

        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.lineId}
              className="flex min-w-0 gap-3 border-b border-outline-variant/40 pb-6 sm:gap-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container sm:h-28 sm:w-24">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.handle}`}
                    className="break-words font-headline-sm text-headline-sm text-primary hover:underline"
                  >
                    {item.title}
                  </Link>
                  {item.variantTitle ? (
                    <p className="mt-1 break-words font-caption text-on-surface-variant">
                      {item.variantTitle}
                    </p>
                  ) : item.detail ? (
                    <p className="mt-1 break-words font-caption text-on-surface-variant">
                      {item.detail}
                    </p>
                  ) : null}
                  {item.available === false ? (
                    <p className="mt-1 font-caption text-error">
                      Currently unavailable
                    </p>
                  ) : null}
                  <p className="mt-2 font-label-md text-primary">
                    {formatCartMoney(item.priceAmount, item.currencyCode)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-outline-variant/50 px-2">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity - 1)
                      }
                      className="p-1 text-on-surface-variant hover:text-primary"
                    >
                      <MaterialIcon name="remove" />
                    </button>
                    <span className="min-w-6 text-center font-label-md">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() =>
                        updateQuantity(item.lineId, item.quantity + 1)
                      }
                      className="p-1 text-on-surface-variant hover:text-primary"
                    >
                      <MaterialIcon name="add" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="flex items-center gap-1 font-caption text-on-surface-variant hover:text-error"
                  >
                    <MaterialIcon name="delete" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 lg:sticky lg:top-32 lg:col-span-5">
        <div className="luxury-shadow min-w-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 sm:p-8">
          <h2 className="mb-6 font-headline-md text-headline-md sm:mb-8">
            Summary
          </h2>
          <div className="mb-6 space-y-3">
            <div className="flex items-start justify-between gap-3 text-body-md">
              <span className="shrink-0 text-on-surface-variant">Subtotal</span>
              <span className="min-w-0 text-right tabular-nums">
                {formatCartMoney(subtotal, currencyCode)}
              </span>
            </div>
            {appliedDiscount && appliedDiscount.discountTotal > 0 ? (
              <div className="flex items-start justify-between gap-3 text-body-md">
                <span className="min-w-0 break-words text-secondary">
                  Discount ({appliedDiscount.code})
                </span>
                <span className="shrink-0 text-right font-medium text-secondary tabular-nums">
                  −
                  {formatCartMoney(
                    appliedDiscount.discountTotal,
                    displayCurrency,
                  )}
                </span>
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-3 text-body-md">
              <span className="shrink-0 text-on-surface-variant">Shipping</span>
              <span className="min-w-0 text-right font-medium text-secondary">
                Calculated at checkout
              </span>
            </div>
            <div className="flex items-end justify-between gap-3 border-t border-outline-variant pt-4">
              <span className="font-headline-md text-headline-md">Total</span>
              <span className="min-w-0 text-right font-headline-md text-headline-md tabular-nums">
                {formatCartMoney(displayTotal, displayCurrency)}
              </span>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-outline-variant/40 bg-surface-container/40 p-4">
            <label
              htmlFor="bag-discount-code"
              className="mb-2 flex items-center gap-2 font-label-md text-primary"
            >
              <MaterialIcon name="sell" className="text-base" />
              Coupon code
            </label>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <input
                id="bag-discount-code"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={discountInput}
                disabled={Boolean(appliedDiscount) || isApplyingDiscount}
                onChange={(event) => {
                  setDiscountInput(event.target.value.toUpperCase());
                  setDiscountError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (!appliedDiscount) void handleApplyDiscount();
                  }
                }}
                placeholder={`e.g. ${WELCOME_OFFER.discountCode}`}
                className="min-w-0 w-full flex-1 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-3 font-body-md tracking-wide text-primary outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary disabled:opacity-70 sm:px-4"
              />
              {appliedDiscount ? (
                <button
                  type="button"
                  onClick={() => void handleRemoveDiscount()}
                  className="shrink-0 rounded-lg border border-outline-variant/50 px-4 py-3 font-label-md text-on-surface-variant transition-colors hover:border-error hover:text-error"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleApplyDiscount()}
                  disabled={isApplyingDiscount || !discountInput.trim()}
                  className="shrink-0 rounded-lg bg-primary px-4 py-3 font-label-md text-on-primary transition-colors hover:bg-on-surface-variant disabled:opacity-60"
                >
                  {isApplyingDiscount ? "…" : "Apply"}
                </button>
              )}
            </div>
            {appliedDiscount ? (
              <p className="mt-2 font-caption text-secondary">
                Code applied
                {appliedDiscount.discountTotal > 0
                  ? ` — you save ${formatCartMoney(appliedDiscount.discountTotal, displayCurrency)}`
                  : ""}
                . It will carry through to checkout.
              </p>
            ) : (
              <p className="mt-2 font-caption text-on-surface-variant">
                Discount is verified and applied on secure checkout.
              </p>
            )}
            {discountError ? (
              <p className="mt-2 font-caption text-error">{discountError}</p>
            ) : null}

            <CouponPicker
              cartSignature={cartSignature}
              hasItems={items.length > 0}
              appliedCode={appliedDiscount?.code ?? null}
              currencyCode={displayCurrency}
              busy={isApplyingDiscount}
              onApply={(code) => void handleApplyDiscount(code)}
            />
          </div>

          {checkoutError ? (
            <p className="mb-4 text-center font-caption text-error">
              {checkoutError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut || unavailableItems.length > 0}
            className="luxury-shadow flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-5 font-label-md text-label-md text-on-primary transition-colors duration-300 hover:bg-on-surface-variant disabled:opacity-60"
          >
            <span className="text-center">
              {isCheckingOut ? "Redirecting…" : "Proceed to Checkout"}
            </span>
            <MaterialIcon name="arrow_forward" className="shrink-0 text-base" />
          </button>
          <p className="mt-3 text-center font-caption text-on-surface-variant">
            You’ll continue on our secure checkout.
          </p>
          <Link
            href="/collections"
            className="mt-4 block text-center font-caption text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
