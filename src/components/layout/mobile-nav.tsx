"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MaterialIcon } from "@/components/shared/material-icon";
import { ProductSearch } from "@/components/shared/product-search";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type MobileNavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  links: MobileNavLink[];
  /** When opening via the header search icon, focus the search field. */
  focusSearch?: boolean;
};

export function MobileNav({
  open,
  onClose,
  links,
  focusSearch = false,
}: MobileNavProps) {
  const pathname = usePathname();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevPathname = useRef(pathname);
  const { count } = useCart();
  const whatsappUrl = getWhatsAppOrderUrl();

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!focusSearch) {
      closeRef.current?.focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, focusSearch]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-primary/40 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-surface pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/40 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo showName={false} imageClassName="h-10 w-10" />
            <div>
              <p
                id={titleId}
                className="font-headline-md text-headline-md text-primary"
              >
                Menu
              </p>
              <p className="mt-0.5 font-caption text-on-surface-variant">
                The Fine Pixel
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-low"
            aria-label="Close menu"
          >
            <MaterialIcon name="close" className="text-[28px]" />
          </button>
        </div>

        <div className="border-b border-outline-variant/30 px-5 py-4">
          <ProductSearch
            placeholder="Search notebooks…"
            className="w-full"
            shellClassName="w-full border-outline-variant/40"
            inputClassName="w-full text-body-md"
            autoFocus={open && focusSearch}
          />
        </div>

        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-3.5 font-label-md text-label-md transition-colors",
                  pathname === "/"
                    ? "bg-surface-container-low text-primary"
                    : "text-on-surface hover:bg-surface-container-low",
                )}
              >
                Home
                <MaterialIcon name="home" className="text-on-surface-variant" />
              </Link>
            </li>
            {links.map((link) => {
              const active =
                link.href === "/collections"
                  ? pathname.startsWith("/collections")
                  : false;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3.5 font-label-md text-label-md transition-colors",
                      active
                        ? "bg-surface-container-low text-primary"
                        : "text-on-surface hover:bg-surface-container-low",
                    )}
                  >
                    {link.label}
                    <MaterialIcon
                      name="chevron_right"
                      className="text-on-surface-variant"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-2 border-t border-outline-variant/30 px-1 pt-6">
            <p className="px-2 font-caption tracking-widest text-on-surface-variant uppercase">
              Your atelier
            </p>
            <Link
              href="/bag"
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-3.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <span className="flex items-center gap-3">
                <MaterialIcon name="shopping_bag" />
                Bag
              </span>
              {count > 0 ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-white">
                  {count}
                </span>
              ) : (
                <span className="font-caption text-on-surface-variant">
                  Empty
                </span>
              )}
            </Link>
          </div>
        </nav>

        <div className="space-y-3 border-t border-outline-variant/40 p-5">
          <Link
            href="/collections"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-lg bg-primary py-4 font-label-md text-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            Shop collections
          </Link>
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline py-3.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <MaterialIcon name="chat" className="text-secondary" />
              Customize on WhatsApp
            </a>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export function MobileMenuButton({
  open,
  onClick,
  className,
}: {
  open: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center text-primary transition-opacity hover:opacity-70 active:scale-95",
        className,
      )}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-nav-drawer"
    >
      <MaterialIcon
        name={open ? "close" : "menu"}
        className="text-[26px]"
      />
    </button>
  );
}
