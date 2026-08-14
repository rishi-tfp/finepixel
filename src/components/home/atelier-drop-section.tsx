"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { ATELIER_DROP } from "@/lib/atelier-drop";
import { cn } from "@/lib/utils";

export function AtelierDropSection() {
  const drop = ATELIER_DROP;
  const stageRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    setOffset({ x, y });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  const titleClass = cn(
    "mb-4 max-w-[12ch] font-headline-lg text-[clamp(1.85rem,3.4vw,2.6rem)] leading-[1.05] text-primary transition-all duration-700",
    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
    drop.href ? "underline-offset-4 hover:underline" : null,
  );

  const titleStyle = {
    transitionDelay: visible ? "240ms" : "0ms",
    transform: visible
      ? `translate3d(${offset.x * 0.15}px, ${offset.y * 0.1}px, 0)`
      : undefined,
  } as const;

  return (
    <section
      id="atelier-drop"
      className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop md:py-section-gap"
      aria-labelledby="atelier-drop-title"
    >
      <div className="mb-6 md:mb-8">
        <p className="mb-2 font-label-md text-[13px] tracking-[0.22em] text-secondary uppercase">
          This month’s highlight
        </p>
        <h2
          id="atelier-drop-title"
          className="font-headline-lg text-headline-lg text-primary"
        >
          Atelier Drop
        </h2>
      </div>

      <article
        ref={stageRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="overflow-hidden rounded-[1.75rem] bg-[#F4F1EE] ring-1 ring-black/[0.04]"
      >
        <div className="grid md:grid-cols-12">
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-auto md:min-h-[480px] lg:min-h-[540px]">
            {drop.href ? (
              <Link
                href={drop.href}
                className="absolute inset-0 z-[1]"
                aria-label={`View ${drop.title}`}
              >
                <span className="sr-only">View {drop.title}</span>
              </Link>
            ) : null}
            <div
              className="absolute inset-[-3%] transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translate3d(${offset.x * -0.35}px, ${offset.y * -0.35}px, 0) scale(1.04)`,
              }}
            >
              <OptimizedImage
                src={drop.image}
                alt={drop.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center"
                priority
                quality={92}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#F4F1EE]/40"
            />
          </div>

          <div className="relative z-[2] flex flex-col justify-center px-7 py-10 md:col-span-5 md:px-10 md:py-14 lg:px-12">
            <p
              className={cn(
                "mb-3 font-caption text-[13px] tracking-[0.22em] text-on-surface-variant uppercase transition-all duration-700",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              )}
              style={{ transitionDelay: visible ? "80ms" : "0ms" }}
            >
              {drop.monthLabel}
            </p>

            <p
              className={cn(
                "mb-5 font-label-md text-[13px] tracking-[0.16em] text-secondary uppercase transition-all duration-700",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0",
              )}
              style={{ transitionDelay: visible ? "160ms" : "0ms" }}
            >
              <span className="atelier-drop-status relative inline-block">
                {drop.status}
              </span>
            </p>

            {drop.href ? (
              <Link href={drop.href} className={titleClass} style={titleStyle}>
                {drop.title}
              </Link>
            ) : (
              <h3 className={titleClass} style={titleStyle}>
                {drop.title}
              </h3>
            )}

            <p
              className={cn(
                "mb-6 max-w-sm font-body-md text-body-md leading-relaxed text-on-surface-variant transition-all duration-700",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: visible ? "340ms" : "0ms" }}
            >
              {drop.subtitle}
            </p>

            {drop.note ? (
              <p
                className={cn(
                  "border-t border-black/8 pt-5 font-caption text-[14px] leading-relaxed tracking-[0.02em] text-on-surface-variant/80 transition-all duration-700",
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: visible ? "440ms" : "0ms" }}
              >
                {drop.note}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}
