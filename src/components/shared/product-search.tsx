"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MaterialIcon } from "@/components/shared/material-icon";
import type { CatalogProduct } from "@/lib/shopify/mappers";
import { cn } from "@/lib/utils";

type ProductSearchProps = {
  placeholder?: string;
  inputClassName?: string;
  shellClassName?: string;
  className?: string;
  /** Wider dropdown aligned for collections header */
  wide?: boolean;
  /** Focus the input when this becomes true (e.g. mobile drawer opened via search). */
  autoFocus?: boolean;
};

type ScoredProduct = CatalogProduct & { score: number };

function scoreProduct(product: CatalogProduct, query: string): number | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const title = product.title.toLowerCase();
  const description = (product.description ?? "").toLowerCase();
  const tags = (product.tags ?? []).join(" ").toLowerCase();
  const category = (product.category ?? "").toLowerCase();
  const detail = (product.detail ?? "").toLowerCase();
  const haystack = `${title} ${description} ${tags} ${category} ${detail}`;

  // Substring match anywhere — not startsWith-only
  if (!haystack.includes(q)) return null;

  let score = 0;
  if (title.includes(q)) score += 100;
  if (title.startsWith(q)) score += 40;
  if (title.split(/\s+/).some((word) => word.startsWith(q))) score += 25;
  if (tags.includes(q)) score += 20;
  if (category.includes(q) || detail.includes(q)) score += 10;
  if (description.includes(q)) score += 5;
  // Prefer earlier occurrence in title
  const idx = title.indexOf(q);
  if (idx >= 0) score += Math.max(0, 15 - idx);

  return score;
}

export function ProductSearch({
  placeholder = "Search...",
  inputClassName,
  shellClassName,
  className,
  wide = false,
  autoFocus = false,
}: ProductSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
      setOpen(true);
    }, 50);
    return () => window.clearTimeout(timer);
  }, [autoFocus]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: CatalogProduct[] } | null) => {
        if (!cancelled && data?.products?.length) {
          setCatalog(data.products);
        }
      })
      .catch(() => {
        /* keep empty */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [] as ScoredProduct[];

    return catalog
      .map((product) => {
        const score = scoreProduct(product, q);
        return score == null ? null : ({ ...product, score } as ScoredProduct);
      })
      .filter((item): item is ScoredProduct => item != null)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 8);
  }, [catalog, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goToProduct = useCallback(
    (handle: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/products/${handle}`);
    },
    [router],
  );

  const goToCollectionsSearch = useCallback(() => {
    const q = query.trim();
    setOpen(false);
    if (q) {
      router.push(`/collections?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/collections");
    }
  }, [query, router]);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "Enter")) {
      setOpen(true);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) {
        goToProduct(results[activeIndex].handle);
      } else {
        goToCollectionsSearch();
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div
      ref={rootRef}
      className={cn("relative", wide ? "w-56" : "w-auto", className)}
    >
      <div
        className={cn(
          "flex items-center rounded-full border border-outline-variant/20 bg-surface-container-low px-4 py-2",
          shellClassName,
        )}
      >
        <MaterialIcon
          name="search"
          className="mr-2 text-sm text-on-surface-variant"
        />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="search"
          enterKeyHint="search"
          className={cn(
            "product-search-input w-32 appearance-none border-none bg-transparent font-label-md text-sm text-primary shadow-none outline-none ring-0",
            "placeholder:text-on-surface-variant focus:border-none focus:bg-transparent focus:shadow-none focus:outline-none focus:ring-0",
            wide && "w-40",
            inputClassName,
          )}
          placeholder={placeholder}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {showDropdown ? (
        <div
          id={listId}
          role="listbox"
          className="absolute right-0 z-[60] mt-2 max-h-96 w-[min(22rem,calc(100vw-2rem))] overflow-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-xl"
        >
          {loading && catalog.length === 0 ? (
            <p className="px-4 py-3 font-caption text-on-surface-variant">
              Searching catalog…
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 font-caption text-on-surface-variant">
              No products contain “{query.trim()}”
            </p>
          ) : (
            <ul className="py-2">
              {results.map((product, index) => (
                <li key={product.id} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => goToProduct(product.handle)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                      index === activeIndex
                        ? "bg-surface-container-low"
                        : "hover:bg-surface-container-low/70",
                    )}
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-label-md text-label-md text-primary">
                        {product.title}
                      </p>
                      <p className="truncate font-caption text-on-surface-variant">
                        {product.price}
                        {product.category ? ` · ${product.category}` : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={goToCollectionsSearch}
            className="flex w-full items-center justify-between border-t border-outline-variant/20 px-4 py-3 font-label-md text-label-md text-secondary hover:bg-surface-container-low"
          >
            <span>View all results</span>
            <MaterialIcon name="arrow_right_alt" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
