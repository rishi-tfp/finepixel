"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

const CRAFT_MOMENTS = [
  {
    n: "01",
    title: "Smooth on the pen",
    text: "Cream pages that take ink without shouting through the next sheet.",
    image: images.openPages,
    alt: "Cream notebook pages ready for writing.",
  },
  {
    n: "02",
    title: "Opens flat",
    text: "Twin-wire and hardcover builds stay open — both hands free to think.",
    image: images.spiralBinding,
    alt: "Notebook with metallic binding lying open.",
  },
  {
    n: "03",
    title: "Made to keep",
    text: "Gloss or matte — a cover finish built for years on the desk.",
    image: images.aboutCraft,
    alt: "Craft detail of a Fine Pixel notebook cover.",
  },
] as const;

/**
 * Typographic trust line under buy buttons.
 */
export function ProductTrustNotes() {
  return (
    <div className="mt-6 border-t border-outline-variant/50 pt-4">
      <p className="font-caption tracking-[0.12em] text-on-surface-variant uppercase">
        <span className="text-secondary">India shipping</span>
        <span className="mx-2.5 text-outline-variant" aria-hidden>
          /
        </span>
        <span className="text-secondary">Made to order</span>
        <span className="mx-2.5 text-outline-variant" aria-hidden>
          /
        </span>
        <span className="text-secondary">Gift-ready packing</span>
      </p>
    </div>
  );
}

/**
 * Horizontal cinema strip — scroll-snap lookbook for how writing feels.
 */
export function ProductCraftNotes() {
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setProgress(max > 0 ? rail.scrollLeft / max : 0);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative left-1/2 mt-section-gap w-screen max-w-[100vw] -translate-x-1/2 bg-surface-container-low py-14 md:py-20">
      <div className="mx-auto mb-8 flex max-w-container-max flex-col gap-6 px-margin-mobile md:mb-12 md:flex-row md:items-end md:justify-between md:px-margin-desktop">
        <div className="max-w-xl">
          <p className="mb-2 font-label-md text-label-md uppercase tracking-[0.22em] text-secondary">
            On the page
          </p>
          <h2 className="font-display-lg text-display-lg-mobile text-primary md:text-[48px] md:leading-tight">
            How it feels to write
          </h2>
        </div>
        <p className="max-w-xs font-body-md text-on-surface-variant md:text-right">
          Drag sideways — three quiet choices that make the notebook disappear
          under your hand.
        </p>
      </div>

      <div
        ref={railRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-margin-mobile pb-4 md:gap-6 md:px-margin-desktop"
      >
        {CRAFT_MOMENTS.map((moment, index) => (
          <article
            key={moment.title}
            className={cn(
              "group relative w-[82vw] shrink-0 snap-center overflow-hidden sm:w-[58vw] md:w-[42vw] lg:w-[34vw]",
              index === 1 && "md:mt-10",
              index === 2 && "md:mt-4",
            )}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <OptimizedImage
                src={moment.image}
                alt={moment.alt}
                fill
                sizes="(max-width: 768px) 82vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                <span className="mb-2 block font-label-md text-caption tracking-[0.28em] text-secondary-fixed">
                  {moment.n}
                </span>
                <h3 className="mb-2 font-headline-lg text-headline-lg text-white">
                  {moment.title}
                </h3>
                <p className="max-w-sm font-body-md text-white/75">
                  {moment.text}
                </p>
              </div>
            </div>
          </article>
        ))}
        <div className="w-[8vw] shrink-0 md:w-[4vw]" aria-hidden />
      </div>

      <div className="mx-auto mt-6 max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="h-[2px] w-full overflow-hidden bg-outline-variant/40">
          <div
            className="h-full bg-secondary transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Full-bleed personalisation — dramatic, one composition.
 */
export function ProductPersonalizeCta({
  productTitle,
}: {
  productTitle: string;
}) {
  return (
    <section className="relative left-1/2 mt-section-gap w-screen max-w-[100vw] -translate-x-1/2">
      <div className="relative min-h-[480px] overflow-hidden md:min-h-[580px]">
        <OptimizedImage
          src={images.personalized}
          alt="Personalized Fine Pixel notebook with foil detail"
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.55)_100%)]" />
        <p
          aria-hidden
          className="pointer-events-none absolute -bottom-6 right-0 select-none font-display-lg text-[28vw] leading-none text-white/[0.06] md:text-[18vw]"
        >
          YOURS
        </p>
        <div className="relative z-10 flex min-h-[480px] items-center px-margin-mobile py-16 md:min-h-[580px] md:px-margin-desktop md:py-20">
          <div className="mx-auto w-full max-w-container-max">
            <div className="max-w-lg border border-white/15 bg-black/25 p-8 backdrop-blur-sm md:p-10">
              <p className="mb-3 font-label-md text-label-md uppercase tracking-[0.22em] text-secondary-fixed">
                Make it yours
              </p>
              <h2 className="mb-4 font-display-lg text-display-lg-mobile text-white md:text-[44px] md:leading-tight">
                Your name.
                <br />
                Your mark.
                <br />
                Their gift.
              </h2>
              <p className="mb-8 font-body-md text-white/75">
                Pair {productTitle} with foil personalisation in the studio
                customizer — designed once, made to order.
              </p>
              <Link
                href="/customizer"
                className="inline-flex items-center gap-3 border border-white bg-white px-8 py-4 font-label-md text-primary transition-colors hover:bg-secondary-fixed hover:border-secondary-fixed"
              >
                Open the customizer
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
