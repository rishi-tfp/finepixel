"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { images } from "@/lib/images";
import {
  BINDINGS,
  COVER_COLORS,
  DEFAULT_CUSTOMIZER,
  FOIL_COLORS,
  MATERIALS,
  buildCustomizerAttributes,
  clearCustomizerDraft,
  customizerDetailLine,
  loadCustomizerDraft,
  resolveCustomizerProduct,
  saveCustomizerDraft,
  type CustomizerConfig,
} from "@/lib/customizer";
import type { CatalogProduct } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "1. Cover" },
  { id: 2, label: "2. Binding" },
  { id: 3, label: "3. Details" },
  { id: 4, label: "4. Review" },
] as const;

export function CustomizerStudio() {
  const router = useRouter();
  const { addItem } = useCart();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<CustomizerConfig>(DEFAULT_CUSTOMIZER);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadCustomizerDraft();
    if (draft) setConfig(draft);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = (await res.json()) as { products?: CatalogProduct[] };
        if (!cancelled) setProducts(data.products ?? []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const baseProduct = useMemo(
    () => resolveCustomizerProduct(products, config.binding.id),
    [products, config.binding.id],
  );

  const displayPrice = baseProduct?.price ?? "—";
  const foilText = config.foilText.trim().toUpperCase().slice(0, 12);

  const materialBadge =
    config.texture.id === "linen"
      ? {
          title: "Premium Linen Cover",
          subtitle: "Sourced from Northern France",
        }
      : {
          title: "Fine Grain Leather",
          subtitle: "Italian calfskin, atelier finished",
        };

  const switchStep = (next: number) => {
    setStep(next);
    setAdded(false);
    setError(null);
  };

  const handleSaveDraft = () => {
    saveCustomizerDraft(config);
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleAddToBag = () => {
    if (!baseProduct?.defaultVariantId) {
      setError(
        loadingProducts
          ? "Loading shop catalog…"
          : "This configuration isn’t available yet. Please try again later or order via WhatsApp.",
      );
      return;
    }

    setAdding(true);
    setError(null);

    const attributes = buildCustomizerAttributes(config);
    void addItem(baseProduct, 1, baseProduct.defaultVariantId, {
      attributes,
      detail: customizerDetailLine(config),
      title: `Bespoke · ${baseProduct.title}`,
    });

    clearCustomizerDraft();
    window.setTimeout(() => {
      setAdding(false);
      setAdded(true);
      window.setTimeout(() => router.push("/bag"), 700);
    }, 600);
  };

  const handleMainAction = () => {
    if (step < 4) {
      switchStep(step + 1);
      return;
    }
    handleAddToBag();
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-container-max flex-col md:flex-row">
      {/* Live preview */}
      <section className="relative flex w-full items-center justify-center overflow-hidden border-r border-outline-variant/20 bg-surface-container-low/30 p-8 md:w-3/5 md:p-16 lg:w-2/3">
        <div
          className="preview-transition relative z-10 aspect-[3/4] w-full max-w-[500px] transform rounded-lg shadow-2xl hover:scale-[1.02]"
          id="notebook-container"
        >
          <div
            className="preview-transition absolute inset-0 overflow-hidden rounded-lg shadow-inner bg-cover bg-center"
            style={{
              backgroundColor: config.color.hex,
              backgroundImage: `linear-gradient(135deg, ${config.color.hex}ee, ${config.color.hex}99), url('${images.customizerPreview}')`,
              backgroundBlendMode: "multiply",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
          <div
            className={cn(
              "absolute top-0 bottom-0 left-0 rounded-l-lg border-r border-white/5",
              config.binding.id === "spiral"
                ? "w-12 bg-gradient-to-r from-zinc-400 to-zinc-800 opacity-80"
                : "w-8 bg-black/10",
            )}
          />
          <div
            className={cn(
              "absolute right-8 bottom-12 text-right font-label-md tracking-[0.2em] transition-all duration-500",
              foilText
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <span style={{ color: config.foilColor.hex }}>{foilText}</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">
              {materialBadge.title}
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              {materialBadge.subtitle}
            </span>
          </div>
          <span className="material-symbols-outlined text-secondary">
            verified
          </span>
        </div>
      </section>

      {/* Controls */}
      <section className="flex w-full flex-col bg-white md:w-2/5 lg:w-1/3">
        <div className="border-b border-outline-variant/30 px-8 pt-10 pb-6">
          <h1 className="mb-6 font-headline-lg text-headline-lg text-primary">
            Create Your Legacy
          </h1>
          <div className="flex justify-between gap-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => switchStep(s.id)}
                className={cn(
                  "pb-2 font-label-md text-label-md transition-all",
                  step === s.id
                    ? "step-active"
                    : "text-on-surface-variant hover:text-primary",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-10">
          {step === 1 ? (
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                  Select Color
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {COVER_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      aria-label={color.label}
                      onClick={() =>
                        setConfig((c) => ({ ...c, color }))
                      }
                      className={cn(
                        "aspect-square w-full rounded-full transition-transform hover:scale-105",
                        color.hex === "#E5E2E1" && "border border-outline-variant",
                        config.color.hex === color.hex && "swatch-active",
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                  Material Texture
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {MATERIALS.map((material) => {
                    const selected = config.texture.id === material.id;
                    return (
                      <label
                        key={material.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all",
                          selected
                            ? "border-primary bg-surface-container-low"
                            : "border-outline-variant hover:border-primary",
                        )}
                      >
                        <input
                          type="radio"
                          name="texture"
                          className="accent-primary"
                          checked={selected}
                          onChange={() =>
                            setConfig((c) => ({ ...c, texture: material }))
                          }
                        />
                        <div className="flex flex-col">
                          <span className="font-body-md font-medium">
                            {material.label}
                          </span>
                          <span className="font-caption text-on-surface-variant">
                            {material.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                  Binding Style
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {BINDINGS.map((binding) => {
                    const selected = config.binding.id === binding.id;
                    return (
                      <button
                        key={binding.id}
                        type="button"
                        onClick={() =>
                          setConfig((c) => ({ ...c, binding }))
                        }
                        className={cn(
                          "flex items-center gap-6 rounded-xl border-2 p-6 text-left transition-all",
                          selected
                            ? "border-primary bg-surface-container-low"
                            : "border-outline-variant hover:border-secondary",
                        )}
                      >
                        <span
                          className={cn(
                            "material-symbols-outlined text-4xl",
                            selected
                              ? "text-primary"
                              : "text-on-surface-variant",
                          )}
                        >
                          {binding.id === "hardcover" ? "menu_book" : "reorder"}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-body-md font-medium">
                            {binding.label}
                          </span>
                          <span className="font-caption text-on-surface-variant">
                            {binding.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                  Custom Embossing
                </h3>
                <div className="space-y-4">
                  <label className="block font-caption text-on-surface-variant">
                    Your Text (Max 12 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={config.foilText}
                    onChange={(e) =>
                      setConfig((c) => ({
                        ...c,
                        foilText: e.target.value.slice(0, 12),
                      }))
                    }
                    placeholder="A. GAUGE"
                    className="w-full rounded-lg border border-outline-variant px-4 py-3 text-body-md tracking-widest uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="font-label-md text-label-md tracking-widest text-on-surface-variant uppercase">
                  Foil Color
                </h3>
                <div className="flex gap-4">
                  {FOIL_COLORS.map((foil) => (
                    <button
                      key={foil.hex}
                      type="button"
                      aria-label={foil.label}
                      onClick={() =>
                        setConfig((c) => ({ ...c, foilColor: foil }))
                      }
                      className={cn(
                        "h-12 w-12 rounded-full border-2 shadow-inner",
                        config.foilColor.hex === foil.hex
                          ? "border-primary"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: foil.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-8">
              <div className="space-y-4 rounded-xl bg-surface-container p-6">
                <h3 className="border-b border-outline-variant pb-2 font-label-md text-label-md">
                  Configuration Summary
                </h3>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">Cover Color</span>
                  <span className="font-medium">{config.color.label}</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">Material</span>
                  <span className="font-medium">{config.texture.label}</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">Binding</span>
                  <span className="font-medium">{config.binding.label}</span>
                </div>
                <div className="flex justify-between text-body-md">
                  <span className="text-on-surface-variant">
                    Personalization
                  </span>
                  <span className="font-medium">
                    {foilText
                      ? `${foilText} · ${config.foilColor.label}`
                      : "None"}
                  </span>
                </div>
                {baseProduct ? (
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Base product</span>
                    <span className="max-w-[55%] text-right font-medium">
                      {baseProduct.title}
                    </span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-outline-variant pt-4 font-headline-md">
                  <span>Total</span>
                  <span className="text-secondary">{displayPrice}</span>
                </div>
              </div>
              <p className="font-caption leading-relaxed text-on-surface-variant">
                Each Fine Pixel notebook is crafted to order. Your cover, binding,
                and embossing choices are saved with your order at checkout.
              </p>
              {error ? (
                <p className="font-caption text-error">{error}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex gap-4 border-t border-outline-variant/30 p-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 rounded-lg border border-outline px-6 py-4 font-label-md text-on-surface transition-all hover:bg-surface-container"
          >
            {draftSaved ? "Draft Saved" : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={handleMainAction}
            disabled={adding || (step === 4 && loadingProducts)}
            className={cn(
              "flex-[2] rounded-lg px-6 py-4 font-label-md text-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60",
              added ? "bg-secondary" : "bg-primary",
            )}
          >
            {step < 4
              ? "Next Step"
              : adding
                ? "Processing…"
                : added
                  ? "Added to Bag"
                  : "Add to Collection"}
          </button>
        </div>
        <p className="px-8 pb-6 text-center font-caption text-on-surface-variant">
          Prefer ready-made?{" "}
          <Link href="/collections" className="underline hover:text-primary">
            Browse collections
          </Link>
        </p>
      </section>
    </div>
  );
}
