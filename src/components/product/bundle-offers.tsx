"use client";

import { OptimizedImage } from "@/components/shared/optimized-image";
import type { CatalogProduct } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";

export type BundleOffer = {
  id: "single" | "pair" | "trio";
  quantity: number;
  label: string;
  savings: number;
  discountCode?: string;
  badge?: string;
};

/**
 * Matching codes must exist in Shopify Admin:
 * BUNDLE100 = ₹100 off when any 2 eligible notebooks are in the cart
 * BUNDLE200 = ₹200 off when any 3 eligible notebooks are in the cart
 */
export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: "single",
    quantity: 1,
    label: "Buy 1",
    savings: 0,
  },
  {
    id: "pair",
    quantity: 2,
    label: "Buy any 2",
    savings: 100,
    discountCode: "BUNDLE100",
    badge: "Popular",
  },
  {
    id: "trio",
    quantity: 3,
    label: "Buy any 3",
    savings: 200,
    discountCode: "BUNDLE200",
    badge: "Best value",
  },
];

function formatMoney(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode || "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, amount));
}

export function BundleOffers({
  unitPrice,
  currencyCode,
  selectedId,
  suggestions,
  selectedHandles,
  onSelect,
  onToggleSuggestion,
}: {
  unitPrice: number;
  currencyCode: string;
  selectedId: BundleOffer["id"];
  suggestions: CatalogProduct[];
  selectedHandles: string[];
  onSelect: (offer: BundleOffer) => void;
  onToggleSuggestion: (product: CatalogProduct) => void;
}) {
  const selectedOffer =
    BUNDLE_OFFERS.find((offer) => offer.id === selectedId) ?? BUNDLE_OFFERS[0];
  const requiredSuggestions = Math.max(0, selectedOffer.quantity - 1);

  return (
    <section
      className="mb-8"
      aria-labelledby="bundle-offers-heading"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-label-md text-[13px] font-semibold tracking-[0.14em] text-secondary uppercase">
            Bundle &amp; save
          </p>
          <h2
            id="bundle-offers-heading"
            className="font-headline-md text-[22px] leading-tight text-primary"
          >
            The more you pick, the more you save
          </h2>
        </div>
        <p className="hidden font-caption text-on-surface-variant sm:block">
          Mix any designs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BUNDLE_OFFERS.map((offer) => {
          const selected = offer.id === selectedId;

          return (
            <button
              key={offer.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(offer)}
              className={cn(
                "relative flex min-h-32 flex-col items-start rounded-xl border p-4 text-left transition-all duration-200",
                selected
                  ? "border-secondary bg-secondary/[0.08] shadow-[0_8px_24px_rgba(120,89,41,0.12)] ring-1 ring-secondary/30"
                  : "border-outline-variant bg-surface-container-lowest hover:border-secondary/60 hover:bg-secondary/[0.03]",
              )}
            >
              {offer.badge ? (
                <span className="absolute -top-2.5 right-3 rounded-full bg-secondary px-2.5 py-1 font-label-md text-[11px] font-bold tracking-wide text-white uppercase">
                  {offer.badge}
                </span>
              ) : null}

              <span className="font-label-md text-[16px] font-bold text-primary">
                {offer.label}
              </span>
              {offer.savings > 0 ? (
                <span className="mt-1 font-body-md text-[14px] font-semibold text-secondary">
                  Save {formatMoney(offer.savings, currencyCode)}
                </span>
              ) : (
                <span className="mt-1 font-body-md text-[14px] text-on-surface-variant">
                  Standard price
                </span>
              )}
              <span className="mt-auto pt-4 font-heading text-[21px] leading-none text-on-surface">
                {offer.savings > 0
                  ? `${formatMoney(offer.savings, currencyCode)} off`
                  : formatMoney(unitPrice, currencyCode)}
              </span>
              <span className="mt-1 font-caption text-[12px] text-on-surface-variant">
                {offer.quantity > 1
                  ? `Choose ${offer.quantity} different designs`
                  : "This design"}
              </span>
            </button>
          );
        })}
      </div>

      {requiredSuggestions > 0 ? (
        <div className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/[0.035] p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-label-md text-[16px] font-bold text-primary">
                Choose{" "}
                {requiredSuggestions === 1
                  ? "another design"
                  : `${requiredSuggestions} more designs`}
              </h3>
              <p className="mt-1 font-caption text-on-surface-variant">
                Your current notebook is already included.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-surface px-3 py-1.5 font-label-md text-[12px] font-bold text-secondary">
              {selectedHandles.length}/{requiredSuggestions} selected
            </span>
          </div>

          {suggestions.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {suggestions.slice(0, 6).map((product) => {
                const selected = selectedHandles.includes(product.handle);
                const selectionFull =
                  selectedHandles.length >= requiredSuggestions;

                return (
                  <button
                    key={product.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={!selected && selectionFull}
                    onClick={() => onToggleSuggestion(product)}
                    className={cn(
                      "group overflow-hidden rounded-xl border bg-surface text-left transition-all disabled:cursor-not-allowed disabled:opacity-45",
                      selected
                        ? "border-secondary ring-2 ring-secondary/25"
                        : "border-outline-variant hover:border-secondary/60",
                    )}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
                      {product.image ? (
                        <OptimizedImage
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 45vw, 220px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                      <span
                        className={cn(
                          "absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border text-[18px] transition-colors",
                          selected
                            ? "border-secondary bg-secondary text-white"
                            : "border-white/80 bg-white/90 text-transparent",
                        )}
                      >
                        ✓
                      </span>
                    </div>
                    <span className="block p-3">
                      <span className="line-clamp-2 block font-label-md text-[13px] font-semibold leading-snug text-primary">
                        {product.title}
                      </span>
                      <span className="mt-1 block font-caption text-[12px] text-on-surface-variant">
                        {product.price}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl bg-surface p-4 font-body-md text-[14px] text-on-surface-variant">
              More designs are unavailable right now. Please try again shortly.
            </p>
          )}
        </div>
      ) : null}

      <p className="mt-3 flex items-center gap-2 font-caption text-on-surface-variant">
        <span className="material-symbols-outlined text-[17px] text-secondary">
          verified
        </span>
        Bundle savings are verified and applied by Shopify.
      </p>
    </section>
  );
}
