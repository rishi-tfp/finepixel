"use client";

import { useMemo, useState } from "react";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const LOOKS = [
  {
    id: "midnight-gold",
    label: "Midnight Gold",
    cover: "#1F1F1F",
    foil: "#C9A26B",
    font: "var(--font-libre-caslon), ui-serif, Georgia, serif",
    italic: false,
    line: "THE FINE PIXEL",
    sub: "MIDNIGHT SERIES",
  },
  {
    id: "sage-rose",
    label: "Sage Rose",
    cover: "#9AAD96",
    foil: "#B76E79",
    font: "var(--font-libre-caslon), ui-serif, Georgia, serif",
    italic: true,
    line: "FOR QUIET HOURS",
    sub: "ATELIER STUDY",
  },
  {
    id: "ivory-silver",
    label: "Ivory Silver",
    cover: "#E9E2D8",
    foil: "#8A8580",
    font: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    italic: false,
    line: "YOUR NAME HERE",
    sub: "PERSONAL EDITION",
  },
  {
    id: "navy-bronze",
    label: "Navy Bronze",
    cover: "#2A3A4A",
    foil: "#B08D57",
    font: "var(--font-libre-caslon), ui-serif, Georgia, serif",
    italic: false,
    line: "BRILLIANT IDEAS",
    sub: "DESK COMPANION",
  },
] as const;

const FOIL_PLAY = [
  { id: "gold", label: "Gold", hex: "#C9A26B" },
  { id: "rose", label: "Rose", hex: "#B76E79" },
  { id: "silver", label: "Silver", hex: "#B8B8BC" },
  { id: "bronze", label: "Bronze", hex: "#B08D57" },
] as const;

const COVER_PLAY = [
  { id: "sage", hex: "#9AAD96", label: "Sage" },
  { id: "navy", hex: "#2A3A4A", label: "Navy" },
  { id: "ivory", hex: "#E9E2D8", label: "Ivory" },
  { id: "charcoal", hex: "#1F1F1F", label: "Charcoal" },
] as const;

const ORDER_STEPS = [
  {
    step: "01",
    title: "Share Your Idea",
    desc: "Tell us the name, initials, logo, artwork, or message you want on your notebook.",
  },
  {
    step: "02",
    title: "Chat on WhatsApp",
    desc: "Message our team on WhatsApp. We’ll refine the details with you and confirm what’s possible.",
  },
  {
    step: "03",
    title: "Approve & Order",
    desc: "Review mockups from our team, then place your personalized order through WhatsApp.",
  },
] as const;

type LookId = (typeof LOOKS)[number]["id"];

function isDarkCover(hex: string) {
  return ["#1F1F1F", "#2A3A4A", "#1C1C1C", "#243447"].includes(
    hex.toUpperCase(),
  );
}

export function CustomizerSection() {
  const [lookId, setLookId] = useState<LookId>("midnight-gold");
  const [foilHex, setFoilHex] = useState(LOOKS[0].foil);
  const [coverHex, setCoverHex] = useState(LOOKS[0].cover);
  const [displayName, setDisplayName] = useState("");

  const look = LOOKS.find((l) => l.id === lookId) ?? LOOKS[0];
  const dark = isDarkCover(coverHex);

  const lineOne = displayName.trim()
    ? displayName.trim().toUpperCase().slice(0, 22)
    : look.line;
  const lineTwo = look.sub;

  const applyLook = (id: LookId) => {
    const next = LOOKS.find((l) => l.id === id) ?? LOOKS[0];
    setLookId(next.id);
    setFoilHex(next.foil);
    setCoverHex(next.cover);
  };

  const whatsappHref = useMemo(() => {
    const message =
      "Hi! I'd like to order a customized Fine Pixel notebook. I've explored the interactive glimpse on your site and would love to discuss a real design with you.";
    return (
      getWhatsAppOrderUrl(message) ??
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
    );
  }, []);

  return (
    <section
      id="customizer"
      className="relative overflow-hidden bg-surface-container py-16 md:py-section-gap"
    >
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:items-center lg:gap-20">
          <div className="lg:col-span-5">
            <p className="mb-4 font-label-md text-[11px] tracking-[0.28em] text-secondary uppercase">
              Made With You
            </p>
            <h2 className="mb-5 max-w-[14ch] font-headline-lg text-headline-lg leading-[1.05] text-primary">
              Your Story, Your Design.
            </h2>
            <p className="mb-10 max-w-md font-body-md leading-relaxed text-on-surface-variant">
              Real notebooks are crafted with our atelier on WhatsApp — not from
              this screen. Explore the glimpse beside you, then begin when
              you&apos;re ready.
            </p>

            <ol>
              {ORDER_STEPS.map((item, index) => (
                <li
                  key={item.step}
                  className="relative flex gap-5 pb-9 last:pb-0"
                >
                  {index < ORDER_STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute top-9 left-[15px] h-[calc(100%-2.25rem)] w-px bg-outline-variant/40"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-caption text-[11px]",
                      index === 0
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant/80 bg-white text-on-surface-variant",
                    )}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="mb-1.5 font-label-md text-label-md text-primary">
                      {item.title}
                    </h3>
                    <p className="max-w-sm font-body-md text-[15px] leading-relaxed text-on-surface-variant">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-lift group mt-4 inline-flex h-auto w-full items-center justify-center gap-2 rounded-full bg-primary px-9 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
            >
              Begin on WhatsApp
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <div>
                <p className="mb-1 font-caption text-[10px] tracking-[0.24em] text-on-surface-variant uppercase">
                  Interactive glimpse
                </p>
                <h3 className="font-headline-md text-headline-md text-primary">
                  Feel a finish.
                </h3>
              </div>
              <p className="hidden font-caption text-[12px] text-on-surface-variant sm:block">
                Inspiration only
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_-36px_rgba(28,24,20,0.35)] ring-1 ring-black/[0.04]">
              {/* Clean studio stage */}
              <div className="relative aspect-[5/4] md:aspect-[16/11]">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(180deg, #F7F5F2 0%, #F1EEEA 48%, #E8E4DF 100%)
                    `,
                  }}
                />
                {/* Soft floor plane */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[38%]"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(210,204,196,0.35) 40%, rgba(196,189,180,0.45))",
                  }}
                />
                {/* Quiet foil wash */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 transition-colors duration-700"
                  style={{
                    background: `radial-gradient(ellipse 45% 40% at 50% 38%, ${foilHex}18, transparent 70%)`,
                  }}
                />

                {/* Notebook */}
                <div className="absolute inset-0 flex items-center justify-center pb-[7%] pt-[4%]">
                  <div className="customizer-notebook relative aspect-[3/4] h-[78%] max-h-[340px] md:max-h-[380px]">
                    {/* Soft contact shadow */}
                    <div
                      aria-hidden
                      className="absolute -bottom-3 left-[8%] right-[8%] h-6 rounded-[100%] bg-black/18 blur-xl transition-opacity duration-700"
                    />

                    <div
                      className="glimpse-cover relative h-full w-full overflow-hidden rounded-[8px] transition-[background-color] duration-700 ease-out"
                      style={{
                        backgroundColor: coverHex,
                        boxShadow: `
                          0 1px 0 rgba(255,255,255,0.12) inset,
                          -1px 0 0 rgba(0,0,0,0.06) inset,
                          0 20px 40px -18px rgba(20,16,12,0.45),
                          0 8px 16px -10px rgba(20,16,12,0.25)
                        `,
                      }}
                    >
                      {/* Clean linen grain (SVG, not photo) */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {/* Soft light falloff */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: dark
                            ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 42%, transparent 58%, rgba(0,0,0,0.28) 100%)"
                            : "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.12) 100%)",
                        }}
                      />
                      {/* Spine */}
                      <div
                        aria-hidden
                        className="absolute inset-y-0 left-0 w-[9%]"
                        style={{
                          background: dark
                            ? "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.08) 70%, transparent)"
                            : "linear-gradient(90deg, rgba(0,0,0,0.14), rgba(0,0,0,0.04) 70%, transparent)",
                          borderRight: dark
                            ? "1px solid rgba(255,255,255,0.04)"
                            : "1px solid rgba(0,0,0,0.04)",
                        }}
                      />
                      {/* Closure band */}
                      <div
                        aria-hidden
                        className="absolute top-[10%] right-0 h-[8%] w-[5.5%] rounded-l-[2px]"
                        style={{
                          backgroundColor: dark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.14)",
                        }}
                      />

                      <div className="absolute inset-y-[18%] right-[11%] left-[16%] flex flex-col items-center justify-center text-center">
                        <p
                          key={`${lookId}-${foilHex}-${lineOne}`}
                          className="customizer-foil-text max-w-full wrap-break-word text-[clamp(14px,2.8vw,28px)] leading-[1.1] tracking-[0.1em] uppercase"
                          style={{
                            color: foilHex,
                            fontFamily: look.font,
                            fontStyle: look.italic ? "italic" : "normal",
                            textShadow: dark
                              ? `0 1px 0 rgba(0,0,0,0.35), 0 0 12px ${foilHex}33`
                              : `0 1px 0 rgba(255,255,255,0.35)`,
                          }}
                        >
                          {lineOne}
                        </p>
                        <div
                          aria-hidden
                          className="my-3 h-px w-8 transition-colors duration-500"
                          style={{ backgroundColor: `${foilHex}66` }}
                        />
                        <p
                          className="max-w-full tracking-[0.28em] uppercase transition-colors duration-500"
                          style={{
                            color: foilHex,
                            fontFamily:
                              "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
                            fontSize: "clamp(7px, 0.95vw, 10px)",
                            opacity: 0.78,
                          }}
                        >
                          {lineTwo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls — calm editorial bar */}
              <div className="border-t border-black/[0.05] bg-[#FBF9F7] px-4 py-4 md:px-6 md:py-5">
                <div className="mb-4 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {LOOKS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => applyLook(item.id)}
                      className={cn(
                        "shrink-0 rounded-full px-3.5 py-1.5 font-label-md text-[12px] transition-all duration-300",
                        lookId === item.id
                          ? "bg-primary text-on-primary"
                          : "bg-transparent text-on-surface-variant hover:bg-black/[0.04] hover:text-primary",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Try a name</span>
                    <input
                      value={displayName}
                      maxLength={22}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Try a name — just for the feel"
                      className="w-full border-0 border-b border-black/10 bg-transparent px-0 py-2 font-label-md text-[13px] text-primary outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-secondary/50"
                    />
                  </label>

                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <span className="font-caption text-[10px] tracking-[0.16em] text-on-surface-variant uppercase">
                        Foil
                      </span>
                      <div className="flex gap-1.5">
                        {FOIL_PLAY.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={item.label}
                            title={item.label}
                            onClick={() => setFoilHex(item.hex)}
                            className="h-6 w-6 rounded-full transition-transform duration-200 hover:scale-110"
                            style={{
                              backgroundColor: item.hex,
                              boxShadow:
                                foilHex === item.hex
                                  ? `0 0 0 1px #fff, 0 0 0 2px ${item.hex}`
                                  : "0 0 0 1px rgba(0,0,0,0.08)",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="h-4 w-px bg-black/10" aria-hidden />

                    <div className="flex items-center gap-2">
                      <span className="font-caption text-[10px] tracking-[0.16em] text-on-surface-variant uppercase">
                        Cover
                      </span>
                      <div className="flex gap-1.5">
                        {COVER_PLAY.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-label={item.label}
                            title={item.label}
                            onClick={() => setCoverHex(item.hex)}
                            className="h-6 w-6 rounded-full transition-transform duration-200 hover:scale-110"
                            style={{
                              backgroundColor: item.hex,
                              boxShadow:
                                coverHex === item.hex
                                  ? "0 0 0 1px #fff, 0 0 0 2px #1c1b1b"
                                  : "0 0 0 1px rgba(0,0,0,0.08)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
