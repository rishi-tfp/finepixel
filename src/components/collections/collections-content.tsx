"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { MaterialIcon } from "@/components/shared/material-icon";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { localProducts } from "@/lib/products";
import type { CatalogProduct, EditionKey } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

type EditionTab = "all" | EditionKey;
type SortKey = "featured" | "price-asc" | "price-desc" | "newest";
type SizeKey = "a5" | "a6" | "pocket";

const EDITION_TABS: { id: EditionTab; label: string }[] = [
  { id: "all", label: "All Editions" },
  { id: "hardcover", label: "Hardcover" },
  { id: "softcover", label: "Softcover" },
  { id: "special", label: "Special Editions" },
  { id: "accessories", label: "Accessories" },
];

const SIZE_OPTIONS: { id: SizeKey; label: string; match: RegExp }[] = [
  { id: "a5", label: "A5 (148 × 210 mm)", match: /\ba5\b/i },
  { id: "a6", label: "A6 (105 × 148 mm)", match: /\ba6\b/i },
  {
    id: "pocket",
    label: "Pocket (90 × 140 mm)",
    match: /\bpocket\b|\b90\s*[x×]\s*140\b/i,
  },
];

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
];

function badgeClass(badge?: string) {
  if (badge === "Bestseller" || badge === "Artisan Crafted") {
    return "font-caption text-caption text-secondary-container bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter";
  }
  if (badge === "Limited Edition") {
    return "font-caption text-caption text-error border border-error/20 px-2 py-0.5 rounded-full uppercase tracking-tighter";
  }
  if (badge) {
    return "font-caption text-caption text-on-surface-variant px-2 py-0.5 rounded-full uppercase tracking-tighter";
  }
  return "";
}

function productMatchesQuery(product: CatalogProduct, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    product.title,
    product.description,
    product.category,
    product.detail,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function productMatchesSizes(product: CatalogProduct, sizes: SizeKey[]) {
  if (sizes.length === 0) return true;
  const haystack = [
    product.title,
    product.description,
    product.detail,
    product.category,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
  return sizes.some((size) => {
    const option = SIZE_OPTIONS.find((item) => item.id === size);
    return option ? option.match.test(haystack) : false;
  });
}

function sortProducts(list: CatalogProduct[], sort: SortKey) {
  const next = [...list];
  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => a.priceAmount - b.priceAmount);
    case "price-desc":
      return next.sort((a, b) => b.priceAmount - a.priceAmount);
    case "newest":
      return next.sort((a, b) => {
        const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
        const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
        return bTime - aTime;
      });
    case "featured":
    default:
      return next;
  }
}

function parseEditionParam(value: string | null): EditionTab {
  if (
    value === "hardcover" ||
    value === "softcover" ||
    value === "special" ||
    value === "accessories"
  ) {
    return value;
  }
  return "all";
}

export function CollectionsContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlEdition = parseEditionParam(searchParams.get("edition"));
  const panelTitleId = useId();
  const shopifyMode = process.env.NEXT_PUBLIC_SHOPIFY_ENABLED === "true";
  const [catalog, setCatalog] = useState<CatalogProduct[]>(() =>
    shopifyMode ? [] : localProducts,
  );
  const [source, setSource] = useState<"local" | "shopify">(
    shopifyMode ? "shopify" : "local",
  );
  const [edition, setEdition] = useState<EditionTab>(urlEdition);
  const [sort, setSort] = useState<SortKey>("featured");
  const [sizes, setSizes] = useState<SizeKey[]>([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    setEdition(urlEdition);
    setPage(0);
  }, [urlEdition]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            products?: CatalogProduct[];
            source?: "local" | "shopify";
          } | null,
        ) => {
          if (data?.products) {
            setCatalog(data.products);
            setSource(data.source ?? (shopifyMode ? "shopify" : "local"));
          } else if (shopifyMode) {
            setCatalog([]);
            setSource("shopify");
          }
        },
      )
      .catch(() => {
        if (shopifyMode) {
          setCatalog([]);
          setSource("shopify");
        }
      });
  }, [shopifyMode]);

  useEffect(() => {
    if (!filterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilterOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  const searched = useMemo(
    () =>
      catalog.filter((product) => productMatchesQuery(product, searchQuery)),
    [catalog, searchQuery],
  );

  const filtered = useMemo(() => {
    const byEdition =
      edition === "all"
        ? searched
        : searched.filter((product) => product.edition === edition);
    const bySize = byEdition.filter((product) =>
      productMatchesSizes(product, sizes),
    );
    return sortProducts(bySize, sort);
  }, [searched, edition, sizes, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize,
  );

  useEffect(() => {
    setPage(0);
  }, [edition, sort, sizes, catalog, searchQuery]);

  const activeFilterCount =
    (edition !== "all" ? 1 : 0) +
    sizes.length +
    (sort !== "featured" ? 1 : 0);

  const toggleSize = (size: SizeKey) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
    );
  };

  const clearFilters = () => {
    setEdition("all");
    setSizes([]);
    setSort("featured");
  };

  return (
    <>
      <section className="relative flex h-[280px] w-full items-center overflow-hidden sm:h-[360px] md:h-[520px] lg:h-[614px]">
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={images.collectionsHero}
            alt="The Fine Pixel collections — premium notebooks on a sunlit wooden desk."
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <h1 className="sr-only">Collections</h1>
      </section>

      <section className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop md:py-section-gap">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body-md text-on-surface-variant">
              Showing {filtered.length}{" "}
              {filtered.length === 1 ? "product" : "products"}
              {edition !== "all"
                ? ` in ${EDITION_TABS.find((t) => t.id === edition)?.label}`
                : ""}
              {searchQuery.trim()
                ? ` matching \u201c${searchQuery.trim()}\u201d`
                : ""}
            </p>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-1 font-caption text-secondary underline-offset-4 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-5 font-label-md text-label-md text-primary transition-colors hover:border-primary"
          >
            <MaterialIcon name="tune" className="text-[22px]" />
            <span>Sort &amp; Filter</span>
            {activeFilterCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-on-primary">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {paged.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low px-8 py-16 text-center">
            <p className="font-headline-md text-headline-md text-primary">
              {searchQuery.trim()
                ? `No products contain \u201c${searchQuery.trim()}\u201d`
                : "No products match these filters"}
            </p>
            <Button
              onClick={() => {
                clearFilters();
                setSearchQuery("");
              }}
              className="mt-8 h-auto rounded-lg bg-primary px-8 py-3 font-label-md text-on-primary hover:bg-primary"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-gutter md:gap-y-16 xl:grid-cols-3">
            {paged.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-500 md:mb-6 md:aspect-[3/4] md:rounded-xl md:bg-surface-container-low md:hover:-translate-y-2 md:hover:shadow-xl">
                  <Link
                    href={`/products/${product.handle}`}
                    className="absolute inset-0"
                  >
                    <OptimizedImage
                      src={product.image || images.designer}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-3 pt-12 opacity-0 transition-all duration-300 group-hover:opacity-100 md:p-4 md:pt-14">
                    <Link
                      href={`/products/${product.handle}`}
                      className="pointer-events-none flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-center font-label-md text-[11px] tracking-wider text-on-primary uppercase transition-opacity hover:opacity-90 group-hover:pointer-events-auto sm:text-xs md:py-3 md:text-sm"
                    >
                      View Notebook
                    </Link>
                  </div>
                </div>
                <Link
                  href={`/products/${product.handle}`}
                  className="flex flex-col"
                >
                  {product.badge ? (
                    <span
                      className={cn(
                        badgeClass(product.badge),
                        "mb-1 hidden md:inline-flex",
                      )}
                    >
                      {product.badge}
                    </span>
                  ) : null}
                  <h3 className="font-body-md font-bold text-primary md:pt-2 md:font-headline-md md:text-headline-md md:font-normal">
                    {product.title}
                  </h3>
                  <p className="mt-0.5 font-caption text-on-surface-variant md:mt-1 md:font-body-md">
                    {product.detail ?? product.category ?? "Notebook"}
                  </p>
                  <p className="mt-1 font-body-md font-bold text-primary md:mt-2 md:font-headline-md md:text-headline-md md:font-normal">
                    {product.price}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}

        {filtered.length > pageSize ? (
          <div className="mt-16 flex items-center justify-center gap-4 md:mt-20">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-variant disabled:opacity-40"
              aria-label="Previous page"
            >
              <MaterialIcon name="chevron_left" />
            </button>
            <span className="font-label-md text-label-md">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant transition-colors hover:bg-surface-variant disabled:opacity-40"
              aria-label="Next page"
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        ) : null}
      </section>

      <section className="bg-surface-container-low py-section-gap">
        <div className="mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <h2 className="mb-6 font-headline-lg text-headline-lg text-primary">
            Join the Intentional Creator List
          </h2>
          <p className="mx-auto mb-10 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
            Message us for early access to special editions and monthly creative
            prompts — we reply personally on WhatsApp.
          </p>
          <a
            href={
              getWhatsAppOrderUrl(
                "Hi! I'd like to join the Intentional Creator List for early access to special editions.",
              ) ??
              "mailto:support@thefinepixel.com?subject=Creator%20list%20signup"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-auto items-center justify-center rounded-lg bg-primary px-10 py-4 font-label-md uppercase tracking-wider text-on-primary transition-opacity hover:opacity-90"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </section>

      {/* Sort & Filter panel — all screen sizes */}
      <div
        className={cn(
          "fixed inset-0 z-[70]",
          filterOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!filterOpen}
      >
        <button
          type="button"
          tabIndex={filterOpen ? 0 : -1}
          aria-label="Close filters"
          onClick={() => setFilterOpen(false)}
          className={cn(
            "absolute inset-0 bg-primary/40 backdrop-blur-[2px] transition-opacity duration-300",
            filterOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={panelTitleId}
          className={cn(
            "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ease-out",
            filterOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-5">
            <div>
              <h2
                id={panelTitleId}
                className="font-headline-md text-headline-md text-primary"
              >
                Sort &amp; Filter
              </h2>
              <p className="mt-1 font-caption text-on-surface-variant">
                {filtered.length}{" "}
                {filtered.length === 1 ? "product" : "products"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-low"
              aria-label="Close"
            >
              <MaterialIcon name="close" className="text-[26px]" />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 space-y-10 overflow-y-auto px-6 py-8">
            <div>
              <h3 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-primary">
                Sort
              </h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSort(option.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-body-md transition-colors",
                      sort === option.id
                        ? "border-primary bg-surface-container-low text-primary"
                        : "border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary",
                    )}
                  >
                    <span>{option.label}</span>
                    {sort === option.id ? (
                      <MaterialIcon name="check" className="text-[20px]" />
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-primary">
                Editions
              </h3>
              <div className="space-y-2">
                {EDITION_TABS.map((tab) => {
                  const count =
                    tab.id === "all"
                      ? searched.length
                      : searched.filter((p) => p.edition === tab.id).length;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEdition(tab.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left font-body-md transition-colors",
                        edition === tab.id
                          ? "border-primary bg-surface-container-low text-primary"
                          : "border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary",
                      )}
                    >
                      <span>{tab.label}</span>
                      <span className="font-caption text-on-surface-variant">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-primary">
                Size
              </h3>
              <div className="space-y-3">
                {SIZE_OPTIONS.map((size) => {
                  const checked = sizes.includes(size.id);
                  return (
                    <label
                      key={size.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant/50 px-4 py-3 transition-colors hover:border-primary"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSize(size.id)}
                        className="h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-0"
                      />
                      <span className="font-body-md text-on-surface">
                        {size.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 border-t border-outline-variant/40 p-5">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-lg border border-outline px-4 py-3.5 font-label-md text-on-surface transition-colors hover:bg-surface-container"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="flex-[2] rounded-lg bg-primary px-4 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90"
            >
              Show {filtered.length}{" "}
              {filtered.length === 1 ? "result" : "results"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
