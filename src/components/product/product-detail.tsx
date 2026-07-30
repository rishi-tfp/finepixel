"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { getLocalProduct } from "@/lib/products";
import {
  resolveVariantId,
  type CatalogProduct,
} from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";
import { productSpecRows } from "@/lib/seo";

const fallbackGallery = [
  {
    src: images.designer,
    alt: "High-definition product shot of a navy blue hardcover designer notebook with gold foil stamping.",
  },
  {
    src: images.spiralBinding,
    alt: "High-definition close-up of a bronze metallic spiral binding on a dark blue notebook.",
  },
  {
    src: images.openPages,
    alt: "An open notebook showing thick, cream-colored pages with a subtle dot grid pattern.",
  },
  {
    src: images.stackedSpiral,
    alt: "Side view of a stacked set of Midnight Bronze notebooks emphasizing the bronze spirals.",
  },
] as const;

const FOIL_SWATCHES: Record<string, string> = {
  gold: "#D4AF37",
  silver: "#C0C0C0",
  "rose gold": "#B76E79",
  rosegold: "#B76E79",
  charcoal: "#36454F",
  black: "#111111",
  copper: "#B87333",
};

function isFoilOption(name: string) {
  return /foil/i.test(name);
}

function isColorOption(name: string) {
  return /^(color|colour)$/i.test(name.trim());
}

function swatchFor(value: string) {
  return FOIL_SWATCHES[value.toLowerCase()] ?? null;
}

type ProductDetailProps = {
  product?: CatalogProduct;
  relatedProducts?: CatalogProduct[];
};

export function ProductDetail({
  product: initialProduct,
  relatedProducts = [],
}: ProductDetailProps) {
  const { addItem } = useCart();
  const product =
    initialProduct ?? getLocalProduct("midnight-bronze-spiral")!;

  const gallery = useMemo(() => {
    if (product.images.length > 0) {
      return product.images.map((src, index) => ({
        src,
        alt: `${product.title} image ${index + 1}`,
      }));
    }
    return [...fallbackGallery];
  }, [product]);

  const initialSelections = useMemo(() => {
    const next: Record<string, string> = {};
    for (const option of product.options) {
      next[option.name] = option.values[0];
    }
    return next;
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [selections, setSelections] =
    useState<Record<string, string>>(initialSelections);

  useEffect(() => {
    setSelections(initialSelections);
    setActiveIndex(0);
  }, [initialSelections, product.id]);

  const active = gallery[activeIndex] ?? gallery[0];

  const selectedVariantId = useMemo(
    () => resolveVariantId(product, selections),
    [product, selections],
  );

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      product.variants[0],
    [product.variants, selectedVariantId],
  );

  useEffect(() => {
    const buttons = document.querySelectorAll("main button");
    const enter = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
    };
    const leave = (e: Event) => {
      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
    };
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
    });
    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  const selectThumb = (index: number) => {
    if (index === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 200);
  };

  const handleAddToBag = async () => {
    if (product.source !== "shopify") {
      window.alert(
        "This product isn’t available for online checkout yet. Please try another notebook.",
      );
      return;
    }
    const result = await addItem(product, 1, selectedVariantId);
    if (!result.ok) {
      window.alert(result.error ?? "Could not add to bag");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = async () => {
    if (!selectedVariantId?.startsWith("gid://shopify/ProductVariant/")) {
      window.alert(
        "Checkout is unavailable for this product right now. Please try again later.",
      );
      return;
    }

    setBuying(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: [{ merchandiseId: selectedVariantId, quantity: 1 }],
        }),
      });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        window.alert(data.error ?? "Checkout failed. Please try again.");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      window.alert("Checkout failed. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  const hasShopifyOptions = product.options.length > 0;
  const isUnavailable = selectedVariant
    ? !selectedVariant.available
    : !product.available;

  return (
    <>
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low">
            <OptimizedImage
              src={active.src}
              alt={active.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className={cn(
                "object-cover transition-all duration-700 group-hover:scale-105",
                fading ? "opacity-0" : "opacity-100",
              )}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((thumb, index) => (
              <button
                key={`${thumb.src}-${index}`}
                type="button"
                onClick={() => selectThumb(index)}
                className="product-thumb aspect-square cursor-pointer overflow-hidden rounded-lg bg-surface-container-low transition-all"
              >
                <OptimizedImage
                  src={thumb.src}
                  alt={thumb.alt}
                  width={200}
                  height={200}
                  sizes="12vw"
                  className="h-full w-full object-cover transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col pt-4 lg:col-span-5 lg:pt-0">
          <nav className="mb-6 flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
            <Link
              href="/collections"
              className="transition-colors hover:text-primary"
            >
              Collections
            </Link>
            <MaterialIcon name="chevron_right" className="text-[12px]" />
            <Link
              href="/collections"
              className="transition-colors hover:text-primary"
            >
              Notebooks
            </Link>
          </nav>
          <h1 className="mb-2 font-headline-lg text-headline-lg text-primary">
            {product.title}
          </h1>
          <p className="mb-6 font-headline-md text-headline-md text-on-surface-variant">
            {selectedVariant?.price ?? product.price}
          </p>
          <p
            className={cn(
              "font-body-md text-body-md leading-relaxed text-on-surface-variant",
              hasShopifyOptions ? "mb-10" : "mb-10",
            )}
          >
            {product.description}
          </p>

          {hasShopifyOptions ? (
            <div className="mb-10 space-y-8">
              {product.options.map((option) => {
                const useSwatches =
                  isFoilOption(option.name) ||
                  isColorOption(option.name) ||
                  option.values.some((value) => Boolean(swatchFor(value)));

                return (
                  <div key={option.name}>
                    <span className="mb-4 block font-label-md text-label-md uppercase tracking-wide text-primary">
                      {option.name}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((value) => {
                        const id = `${option.name}-${value}`.replace(/\s+/g, "-");
                        const checked = selections[option.name] === value;
                        const color = swatchFor(value);

                        if (useSwatches && color) {
                          return (
                            <div key={id} className="relative">
                              <input
                                checked={checked}
                                className="custom-radio hidden"
                                id={id}
                                name={option.name}
                                type="radio"
                                onChange={() =>
                                  setSelections((prev) => ({
                                    ...prev,
                                    [option.name]: value,
                                  }))
                                }
                              />
                              <label
                                className={cn(
                                  "flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border transition-all hover:bg-surface-container-lowest",
                                  checked
                                    ? "border-primary bg-surface-container-lowest"
                                    : "border-outline-variant",
                                )}
                                htmlFor={id}
                              >
                                <div
                                  className="mb-2 h-8 w-8 rounded-full shadow-inner"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="font-label-md text-caption">
                                  {value}
                                </span>
                              </label>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() =>
                              setSelections((prev) => ({
                                ...prev,
                                [option.name]: value,
                              }))
                            }
                            className={cn(
                              "rounded-lg border px-5 py-3 font-label-md text-label-md transition-all",
                              checked
                                ? "border-primary bg-primary text-on-primary"
                                : "border-outline-variant text-primary hover:bg-surface-container-lowest",
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="mb-12 flex flex-col gap-4">
            <Button
              onClick={handleAddToBag}
              disabled={isUnavailable}
              className="h-auto w-full rounded-lg bg-primary py-5 font-label-md text-label-md uppercase tracking-widest text-on-primary transition-opacity hover:bg-primary hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUnavailable
                ? "Out of Stock"
                : added
                  ? "Added to Bag"
                  : "Add to Bag"}
            </Button>
            <Button
              variant="outline"
              onClick={handleBuyNow}
              disabled={isUnavailable || buying}
              className="h-auto w-full rounded-lg border-primary bg-transparent py-5 font-label-md text-label-md uppercase tracking-widest text-primary transition-colors hover:bg-surface-container-lowest disabled:cursor-not-allowed disabled:opacity-50"
            >
              {buying ? "Redirecting…" : "Buy Now"}
            </Button>
          </div>

          {(() => {
            const specs = productSpecRows(product);
            if (specs.length === 0) return null;
            return (
              <div className="border-t border-outline-variant pt-8">
                <h3 className="mb-6 font-label-md text-label-md text-primary">
                  SPECIFICATIONS
                </h3>
                <ul className="space-y-4">
                  {specs.map(({ label, value }) => (
                    <li
                      key={label}
                      className="flex items-center justify-between border-b border-surface-container-high py-2 last:border-0"
                    >
                      <span className="font-body-md text-on-surface-variant">
                        {label}
                      </span>
                      <span className="font-body-md font-medium text-primary">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}
        </div>
      </div>

      {relatedProducts.length > 0 ? (
        <section className="mt-section-gap">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-headline-lg text-headline-lg text-primary">
              You might also like
            </h2>
            <Link
              href="/collections"
              className="font-label-md text-label-md border-b border-secondary text-secondary transition-opacity hover:opacity-70"
            >
              View All Collections
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-gutter lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.handle}`}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
                  {item.image ? (
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  {item.badge ? (
                    <div className="absolute right-4 top-4 rounded-full bg-surface px-3 py-1 font-label-md text-caption">
                      {item.badge}
                    </div>
                  ) : null}
                </div>
                <h3 className="font-label-md text-label-md text-primary transition-colors group-hover:text-secondary">
                  {item.title}
                </h3>
                <p className="text-caption text-on-surface-variant">
                  {item.price}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
