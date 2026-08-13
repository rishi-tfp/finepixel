"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { OptimizedImage } from "@/components/shared/optimized-image";
import {
  MarkFoilFinish,
  MarkFoilStamp,
  MarkLoupe,
  MarkMinimalLayout,
  MarkPaperGrain,
  MarkTwinWire,
} from "@/components/shared/atelier-marks";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

type Mark = ComponentType<{ className?: string }>;

const CHAPTERS = [
  {
    roman: "I",
    title: "Premium Writing Paper",
    desc: "Acid-free cream stock — smooth under the nib, quiet on the reverse. Made for long notes, not ghosted pages.",
    image: images.openPages,
    alt: "Open Fine Pixel notebook showing cream writing pages.",
    Mark: MarkPaperGrain,
  },
  {
    roman: "II",
    title: "Gloss or Matte Cover",
    desc: "Two finishes, one atelier standard. Choose the haptic response your desk wants — shine or soft restraint.",
    image: images.designer,
    alt: "Close detail of a Fine Pixel hardcover finish.",
    Mark: MarkFoilFinish,
  },
  {
    roman: "III",
    title: "Metallic Binding",
    desc: "Twin-wire that lies flat so the page never fights your hand. Built to open fully, day after day.",
    image: images.spiralBinding,
    alt: "Metallic spiral binding on a Fine Pixel notebook.",
    Mark: MarkTwinWire,
  },
] as const;

const LEDGER: { title: string; desc: string; Mark: Mark }[] = [
  {
    title: "Minimal Aesthetic",
    desc: "Quiet covers. Room for the idea.",
    Mark: MarkMinimalLayout,
  },
  {
    title: "Personalisation",
    desc: "Foil marks, made to order.",
    Mark: MarkFoilStamp,
  },
  {
    title: "Attention to Detail",
    desc: "Hand-checked before it leaves.",
    Mark: MarkLoupe,
  },
];

type EssenceOfQualityProps = {
  className?: string;
};

/**
 * Editorial atelier lookbook — asymmetric collage, not a 3-up card grid.
 */
export function EssenceOfQuality({ className }: EssenceOfQualityProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setInView(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % CHAPTERS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [inView]);

  const chapter = CHAPTERS[active] ?? CHAPTERS[0];

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden bg-inverse-surface py-16 text-inverse-on-surface md:py-section-gap",
        className,
      )}
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, #fed398 0%, transparent 42%), radial-gradient(circle at 88% 70%, #e9c086 0%, transparent 36%)",
        }}
      />
      <p
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-4 top-8 select-none font-display-lg text-[22vw] leading-none text-white/[0.04] transition-opacity duration-1000 md:top-0 md:text-[18vw]",
          inView ? "opacity-100" : "opacity-0",
        )}
      >
        ESSENCE
      </p>

      <div className="relative mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-3 font-label-md text-label-md uppercase tracking-[0.22em] text-secondary-fixed">
              Atelier standard
            </p>
            <h2 className="font-display-lg text-display-lg-mobile text-white md:text-display-lg">
              The Essence of Quality
            </h2>
          </div>
          <p className="max-w-sm font-body-md text-white/65 md:col-span-5 md:justify-self-end md:text-right">
            Paper, finish, and binding — staged the way a lookbook stages a
            cover story. Stay a moment; the craft rotates itself.
          </p>
        </div>

        {/* Asymmetric stage */}
        <div className="grid gap-6 md:grid-cols-12 md:gap-5 md:items-stretch">
          {/* Dominant frame */}
          <div className="relative md:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
              {CHAPTERS.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "absolute inset-0 transition-all duration-1000 ease-out",
                    index === active
                      ? "z-10 scale-100 opacity-100"
                      : "z-0 scale-[1.04] opacity-0",
                  )}
                >
                  <OptimizedImage
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between gap-4 p-5 md:p-8">
                <div>
                  <span className="mb-2 block font-label-md text-label-md tracking-[0.3em] text-secondary-fixed">
                    {chapter.roman}
                  </span>
                  <h3 className="font-headline-lg text-headline-lg text-white">
                    {chapter.title}
                  </h3>
                </div>
                <chapter.Mark className="h-12 w-12 shrink-0 text-secondary-fixed md:h-14 md:w-14" />
              </div>
            </div>
          </div>

          {/* Side stack — peeks + story */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <div className="grid grid-cols-3 gap-2 md:grid-cols-1 md:gap-3">
              {CHAPTERS.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={index === active}
                  className={cn(
                    "group relative aspect-square overflow-hidden text-left transition-all duration-500 md:aspect-[16/10]",
                    index === active
                      ? "ring-2 ring-secondary-fixed ring-offset-2 ring-offset-inverse-surface"
                      : "opacity-55 hover:opacity-100",
                  )}
                >
                  <OptimizedImage
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 30vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 font-label-md text-caption tracking-[0.2em] text-white drop-shadow md:left-3 md:top-3">
                    {item.roman}
                  </span>
                </button>
              ))}
            </div>

            <div
              className={cn(
                "flex flex-1 flex-col justify-center border border-white/10 bg-white/[0.04] p-6 backdrop-blur-[2px] transition-all duration-700 md:p-8",
                inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              <p className="mb-4 font-body-lg text-body-lg text-white/85">
                {chapter.desc}
              </p>
              <div className="flex gap-2">
                {CHAPTERS.map((item, index) => (
                  <button
                    key={item.roman}
                    type="button"
                    aria-label={`Show ${item.title}`}
                    onClick={() => setActive(index)}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors duration-500",
                      index === active ? "bg-secondary-fixed" : "bg-white/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Studio ledger */}
        <div className="mt-14 border-t border-white/15 pt-10 md:mt-20">
          <p className="mb-8 font-label-md text-label-md uppercase tracking-[0.22em] text-secondary-fixed">
            Also in the studio
          </p>
          <div className="grid gap-0 md:grid-cols-3">
            {LEDGER.map((item, index) => (
              <div
                key={item.title}
                className={cn(
                  "flex gap-4 border-white/10 py-6 md:px-6 md:py-2",
                  index < LEDGER.length - 1 &&
                    "border-b md:border-b-0 md:border-r",
                )}
              >
                <item.Mark className="mt-1 h-10 w-10 shrink-0 text-secondary-fixed" />
                <div>
                  <h3 className="mb-1.5 font-headline-md text-headline-md text-white">
                    {item.title}
                  </h3>
                  <p className="font-caption text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
