"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MaterialIcon } from "@/components/shared/material-icon";
import {
  PROMOTION_MESSAGES,
  WELCOME_OFFER,
  WELCOME_OFFER_SEEN_KEY,
} from "@/lib/promotions";

function PromotionGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <span
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {PROMOTION_MESSAGES.map((message) => (
        <span
          key={message}
          className="flex shrink-0 items-center gap-6 px-6 sm:gap-10 sm:px-10"
        >
          <span>{message}</span>
          <span className="flex items-center text-secondary-fixed" aria-hidden>
            <MaterialIcon name="diamond" className="text-[12px]" />
          </span>
        </span>
      ))}
    </span>
  );
}

function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_OFFER_SEEN_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

export function PromotionExperience() {
  const [offerOpen, setOfferOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeOffer = useCallback(() => {
    markWelcomeSeen();
    setOfferOpen(false);
    setCopied(false);
  }, []);

  const claimOffer = useCallback(async () => {
    markWelcomeSeen();
    try {
      await navigator.clipboard.writeText(WELCOME_OFFER.discountCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }, []);

  useEffect(() => {
    if (!WELCOME_OFFER.enabled) return;

    try {
      localStorage.removeItem("tfp-welcome-offer-coming-soon-v1");
      if (localStorage.getItem(WELCOME_OFFER_SEEN_KEY) === "1") return;
    } catch {
      /* if storage unavailable, skip popup to avoid repeating every load */
      return;
    }

    const timer = window.setTimeout(() => {
      setOfferOpen(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!offerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOffer();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeOffer, offerOpen]);

  return (
    <>
      <aside
        aria-label="Current promotions"
        className="fixed inset-x-0 top-0 z-55 w-full max-w-full overflow-x-clip bg-primary text-on-primary"
      >
        <div className="relative h-9 w-full overflow-hidden">
          <div className="promotion-marquee absolute inset-y-0 left-0 flex w-max items-center whitespace-nowrap font-label-md text-[13px] font-semibold uppercase tracking-[0.14em] sm:text-sm">
            <PromotionGroup />
            <PromotionGroup hidden />
          </div>
        </div>
      </aside>

      {offerOpen ? (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center bg-black/55 p-5 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeOffer();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-offer-title"
            aria-describedby="welcome-offer-description"
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-surface-container-lowest shadow-2xl"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeOffer}
              aria-label="Close welcome offer"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition-transform hover:scale-105"
            >
              <MaterialIcon name="close" className="text-[22px]" />
            </button>

            <div className="flex flex-col items-center justify-center bg-primary px-8 py-7 text-center text-white">
              <BrandLogo
                showName={false}
                imageClassName="h-14 w-14 invert"
              />
              <p className="mt-2 font-headline-md text-xl uppercase tracking-[0.16em] text-white">
                The Fine Pixel
              </p>
            </div>

            <div className="px-7 pb-8 pt-7 text-center sm:px-10 sm:pb-10">
              <p className="mb-3 font-label-md text-xs uppercase tracking-[0.2em] text-secondary">
                {WELCOME_OFFER.eyebrow}
              </p>
              <h2
                id="welcome-offer-title"
                className="mb-4 font-headline-lg text-headline-lg font-bold text-primary"
              >
                {WELCOME_OFFER.title}
              </h2>
              <p
                id="welcome-offer-description"
                className="mx-auto mb-7 max-w-md font-body-md font-medium leading-relaxed text-on-surface"
              >
                {WELCOME_OFFER.description}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void claimOffer()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-label-md font-semibold text-on-primary transition-opacity hover:opacity-90"
                >
                  <MaterialIcon
                    name={copied ? "check" : "content_copy"}
                    className="text-[18px]"
                  />
                  {copied ? "Code copied!" : WELCOME_OFFER.ctaLabel}
                </button>
                <Link
                  href={WELCOME_OFFER.ctaHref}
                  onClick={closeOffer}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-6 py-4 font-label-md font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  Explore Collections
                  <MaterialIcon
                    name="arrow_forward"
                    className="text-[18px]"
                  />
                </Link>
              </div>
              {copied ? (
                <p className="mt-3 font-caption text-secondary">
                  Paste{" "}
                  <span className="font-semibold tracking-wide">
                    {WELCOME_OFFER.discountCode}
                  </span>{" "}
                  in your bag and tap Apply
                </p>
              ) : null}
              <button
                type="button"
                onClick={closeOffer}
                className="mt-3 block w-full font-caption text-on-surface-variant underline-offset-4 hover:underline"
              >
                Maybe later
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
