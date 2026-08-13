"use client";

import { useEffect, useRef, useState } from "react";
import { formatCartMoney } from "@/components/cart/cart-provider";
import { MaterialIcon } from "@/components/shared/material-icon";

type AvailableCoupon = {
  code: string;
  title: string;
  requirement: string;
  eligible: boolean;
  savings: number;
};

/** Tagged with the bag it describes, so staleness is derived instead of stored. */
type CouponResult = {
  signature: string;
  coupons: AvailableCoupon[];
  bestCode: string | null;
  bestSavings: number;
  error: string | null;
};

type CouponPickerProps = {
  /** Changes whenever bag contents change, so savings are re-scored. */
  cartSignature: string;
  hasItems: boolean;
  appliedCode: string | null;
  currencyCode: string;
  busy: boolean;
  onApply: (code: string) => void;
};

export function CouponPicker({
  cartSignature,
  hasItems,
  appliedCode,
  currencyCode,
  busy,
  onApply,
}: CouponPickerProps) {
  const [result, setResult] = useState<CouponResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasItems) return;
    const controller = new AbortController();

    void (async () => {
      const failure = (error: string): CouponResult => ({
        signature: cartSignature,
        coupons: [],
        bestCode: null,
        bestSavings: 0,
        error,
      });

      try {
        const response = await fetch("/api/discounts/available", {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          coupons?: AvailableCoupon[];
          bestCode?: string | null;
          bestSavings?: number;
          error?: string;
        };
        if (controller.signal.aborted) return;

        if (!response.ok) {
          setResult(failure(data.error ?? "Could not load coupons"));
          return;
        }
        setResult({
          signature: cartSignature,
          coupons: data.coupons ?? [],
          bestCode: data.bestCode ?? null,
          bestSavings: data.bestSavings ?? 0,
          error: null,
        });
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        setResult(failure("Could not load coupons"));
      }
    })();

    return () => controller.abort();
  }, [cartSignature, hasItems]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isLoading = hasItems && result?.signature !== cartSignature;
  const coupons = result?.coupons ?? [];
  const loadError = result?.error ?? null;
  const bestCode = result?.bestCode ?? null;
  const bestSavings = result?.bestSavings ?? 0;

  if (!hasItems) return null;
  if (coupons.length === 0 && !isLoading && !loadError) return null;

  const showSuggestion =
    Boolean(bestCode) && bestSavings > 0 && bestCode !== appliedCode;

  return (
    <div ref={containerRef} className="relative mt-3">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-outline-variant/50 px-3 py-2.5 text-left font-label-md text-primary transition-colors hover:border-primary sm:px-4"
      >
        <span className="flex min-w-0 items-center gap-2">
          <MaterialIcon name="local_activity" className="shrink-0 text-base" />
          <span className="truncate">
            {isLoading ? "Checking coupons…" : "Available coupons"}
          </span>
        </span>
        <MaterialIcon
          name={isOpen ? "expand_less" : "expand_more"}
          className="shrink-0 text-base"
        />
      </button>

      {showSuggestion && !isOpen && !isLoading ? (
        <p className="mt-2 font-caption text-secondary">
          Best for your bag: <span className="tracking-wide">{bestCode}</span> —
          save {formatCartMoney(bestSavings, currencyCode)}
        </p>
      ) : null}

      {isOpen ? (
        <div className="luxury-shadow absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-2">
          {loadError ? (
            <p className="px-2 py-3 font-caption text-error">{loadError}</p>
          ) : null}

          {!loadError && coupons.length === 0 ? (
            <p className="px-2 py-3 font-caption text-on-surface-variant">
              {isLoading
                ? "Checking which coupons fit your bag…"
                : "No coupons available right now."}
            </p>
          ) : null}

          <ul className="space-y-1">
            {coupons.map((coupon) => {
              const isApplied = coupon.code === appliedCode;
              const isBest = coupon.code === bestCode;
              return (
                <li key={coupon.code}>
                  <button
                    type="button"
                    disabled={!coupon.eligible || isApplied || busy || isLoading}
                    onClick={() => {
                      onApply(coupon.code);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-lg border border-outline-variant/30 p-3 text-left transition-colors enabled:hover:border-primary disabled:cursor-default disabled:opacity-60"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-label-md tracking-wide text-primary">
                        {coupon.code}
                      </span>
                      {isBest && !isApplied ? (
                        <span className="rounded-full bg-secondary/15 px-2 py-0.5 font-caption text-secondary">
                          Best value
                        </span>
                      ) : null}
                      {isApplied ? (
                        <span className="rounded-full bg-secondary/15 px-2 py-0.5 font-caption text-secondary">
                          Applied
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block font-caption text-on-surface-variant">
                      {coupon.title}
                    </span>
                    <span className="mt-1 block font-caption">
                      {coupon.eligible ? (
                        <span className="text-secondary">
                          {coupon.savings > 0
                            ? `You save ${formatCartMoney(coupon.savings, currencyCode)}`
                            : "Applies to your bag"}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant/80">
                          {coupon.requirement}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
