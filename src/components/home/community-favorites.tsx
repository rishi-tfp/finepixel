"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { localProducts } from "@/lib/products";
import type { CatalogProduct } from "@/lib/shopify/mappers";
import { productCardSubtitle } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";

function productHoverImage(product: CatalogProduct) {
  const primary = product.image || product.images[0] || "";
  return (
    product.images.find((src) => src && src !== primary) ||
    undefined
  );
}

const BESTSELLER_TAG = /best[-_\s]?sellers?/i;

export function isBestsellerProduct(product: CatalogProduct) {
  if (product.tags.some((tag) => BESTSELLER_TAG.test(tag))) return true;
  if (product.badge && BESTSELLER_TAG.test(product.badge)) return true;
  return false;
}

export function BestSellers() {
  const shopifyMode = process.env.NEXT_PUBLIC_SHOPIFY_ENABLED === "true";
  const [products, setProducts] = useState<CatalogProduct[]>(() =>
    shopifyMode ? [] : localProducts.filter(isBestsellerProduct),
  );
  const [loading, setLoading] = useState(shopifyMode);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: CatalogProduct[] } | null) => {
        if (!data?.products) {
          if (shopifyMode) setProducts([]);
          return;
        }
        const bestsellers = data.products.filter(isBestsellerProduct);
        if (bestsellers.length > 0) {
          setProducts(bestsellers);
          return;
        }
        setProducts(data.products.slice(0, 4));
      })
      .catch(() => {
        if (shopifyMode) setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [shopifyMode]);

  return (
    <section
      className="bg-surface-container px-margin-mobile py-16 md:bg-transparent md:px-margin-desktop md:py-section-gap"
      id="best-sellers"
    >
      <div className="mx-auto max-w-container-max">
        <h2 className="mb-10 text-center font-headline-lg text-headline-lg md:mb-16">
          The Community Favorites
        </h2>
        {loading ? (
          <p className="text-center font-body-md text-on-surface-variant">
            Loading favorites…
          </p>
        ) : products.length === 0 ? (
          <p className="text-center font-body-md text-on-surface-variant">
            New favorites are on the way — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-gutter">
            {products.map((product) => {
              const primaryImage = product.image || product.images[0];
              const hoverImage = productHoverImage(product);

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="group flex flex-col"
                >
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
                    {primaryImage ? (
                      <OptimizedImage
                        src={primaryImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={cn(
                          "object-cover transition-[opacity,transform] duration-500",
                          hoverImage
                            ? "group-hover:opacity-0"
                            : "group-hover:scale-105",
                        )}
                      />
                    ) : null}
                    {hoverImage ? (
                      <OptimizedImage
                        src={hoverImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    ) : null}
                    <span className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-primary px-5 py-2 font-label-md text-on-primary opacity-0 transition-all group-hover:opacity-100 md:inline-flex">
                      View product
                    </span>
                  </div>
                  <h4 className="mb-1 font-body-md font-bold text-primary">
                    {product.title}
                  </h4>
                  {productCardSubtitle(product) ? (
                    <p className="mb-1 font-caption text-on-surface-variant">
                      {productCardSubtitle(product)}
                    </p>
                  ) : null}
                  <p className="font-body-md font-bold text-primary">
                    {product.price}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
