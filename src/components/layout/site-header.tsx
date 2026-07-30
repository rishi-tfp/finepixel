"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AccountButton } from "@/components/auth/account-button";
import { CartButton } from "@/components/cart/cart-button";
import {
  MobileMenuButton,
  MobileNav,
  type MobileNavLink,
} from "@/components/layout/mobile-nav";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MaterialIcon } from "@/components/shared/material-icon";
import { ProductSearch } from "@/components/shared/product-search";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "home" | "product" | "collections";
  links?: MobileNavLink[];
  showSearch?: boolean;
};

/** Same tabs on every page (homepage nav). */
const HOME_NAV_LINKS: MobileNavLink[] = [
  { href: "/collections", label: "Collections" },
  { href: "/#customizer", label: "Customizer" },
  { href: "/#studio", label: "Our Story" },
];

function NavTabs({
  links,
  className,
}: {
  links: MobileNavLink[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden items-center justify-center gap-6 md:flex",
        className,
      )}
    >
      {links.map((link) => {
        const active =
          link.href === "/collections"
            ? pathname.startsWith("/collections")
            : false;

        return (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "font-label-md text-label-md transition-colors",
              active
                ? "relative text-primary after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-secondary after:content-['']"
                : "text-on-surface-variant hover:text-primary",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export function SiteHeader({
  variant = "home",
  links,
  showSearch,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFocusSearch, setMobileFocusSearch] = useState(false);
  const resolvedLinks = links ?? HOME_NAV_LINKS;
  const searchVisible =
    showSearch ??
    (variant === "home" ||
      variant === "collections" ||
      variant === "product");

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileFocusSearch(false);
  }, []);
  const openMobileSearch = useCallback(() => {
    setMobileFocusSearch(true);
    setMobileOpen(true);
  }, []);
  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => {
      if (prev) setMobileFocusSearch(false);
      return !prev;
    });
  }, []);

  useEffect(() => {
    if (variant !== "home") return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  return (
    <>
      <header
        className={cn(
          "fixed top-9 z-50 w-full bg-surface/90 shadow-sm backdrop-blur-md",
          "border-b border-outline-variant/30",
          variant === "home" && "transition-all duration-300",
          variant === "home" && scrolled && "glass-nav",
        )}
      >
        {/* Mobile top bar — hamburger | brand | search + bag (equal side rails) */}
        <div className="grid h-16 grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] items-center px-margin-mobile md:hidden">
          <div className="flex justify-start">
            <MobileMenuButton open={mobileOpen} onClick={toggleMobile} />
          </div>
          <Link
            href="/"
            aria-label="The Fine Pixel home"
            className="min-w-0 justify-self-center text-primary"
          >
            <BrandLogo
              className="gap-1.5 text-[16px]"
              imageClassName="h-8 w-8"
            />
          </Link>
          <div className="flex items-center justify-end gap-0.5">
            <button
              type="button"
              onClick={openMobileSearch}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-primary transition-opacity hover:opacity-70 active:scale-95"
              aria-label="Search"
            >
              <MaterialIcon name="search" className="text-[24px]" />
            </button>
            <CartButton />
          </div>
        </div>

        {/* Desktop top bar */}
        <div
          className={cn(
            "mx-auto hidden h-20 max-w-container-max grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-margin-desktop md:grid",
            variant === "home" && scrolled && "h-16",
          )}
        >
          <Link
            href="/"
            aria-label="The Fine Pixel home"
            className={cn(
              "justify-self-start text-primary",
              variant === "home" && "font-bold",
            )}
          >
            <BrandLogo
              className="text-headline-md"
              imageClassName={cn(
                "h-10 w-10 transition-all duration-300",
                variant === "home" && scrolled && "h-8 w-8",
              )}
            />
          </Link>

          <NavTabs
            links={resolvedLinks}
            className={variant === "home" ? "gap-6" : "gap-8"}
          />

          <div className="flex items-center justify-end gap-5">
            {searchVisible ? (
              <div
                className={cn(
                  variant === "collections" ? "hidden lg:block" : "block",
                )}
              >
                <ProductSearch
                  wide={variant === "collections"}
                  placeholder={
                    variant === "collections"
                      ? "Search our craft..."
                      : "Search..."
                  }
                  shellClassName={
                    variant === "collections"
                      ? "border-outline-variant/30"
                      : undefined
                  }
                  inputClassName={
                    variant === "collections" ? "text-label-md" : undefined
                  }
                />
              </div>
            ) : null}

            <CartButton />
            <AccountButton
              className={cn(
                "transition-all duration-200",
                variant === "home"
                  ? "rounded-full p-2 hover:bg-surface-container-low/50"
                  : "hover:opacity-70",
              )}
            />
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={closeMobile}
        links={resolvedLinks}
        focusSearch={mobileFocusSearch}
      />
    </>
  );
}
