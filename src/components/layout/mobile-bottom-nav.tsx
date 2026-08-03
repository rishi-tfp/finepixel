"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/shared/material-icon";
import { cn } from "@/lib/utils";

const items = [
  {
    href: "/collections",
    label: "Collections",
    icon: "grid_view",
    match: (path: string, hash: string) =>
      path.startsWith("/collections") && !hash,
  },
  {
    href: "/#customizer",
    label: "Customize",
    icon: "edit_note",
    match: (path: string, hash: string) =>
      path === "/" && hash === "#customizer",
  },
  {
    href: "/account",
    label: "Account",
    icon: "person",
    match: (path: string) => path.startsWith("/account"),
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex h-20 w-full max-w-full items-center justify-around border-t border-outline-variant/30 bg-surface px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] sm:px-4 md:hidden"
      aria-label="Primary"
    >
      {items.map((item) => {
        const active =
          item.href === "/#customizer"
            ? item.match(pathname, hash)
            : item.href === "/collections"
              ? item.match(pathname, hash)
              : item.match(pathname);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 font-caption transition-colors",
              active ? "text-primary" : "text-on-surface-variant",
            )}
          >
            <MaterialIcon name={item.icon} className="text-[24px]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
