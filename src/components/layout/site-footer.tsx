import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";
import { MaterialIcon } from "@/components/shared/material-icon";

const LINK_COLS = [
  {
    title: "Shop",
    items: [
      { label: "Collections", href: "/collections" },
      { label: "Corporate Orders", href: "/corporate" },
      { label: "Customizer", href: "/#customizer" },
      { label: "Our Story", href: "/#studio" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Contact", href: "mailto:support@thefinepixel.com" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;

const SOCIAL = [
  {
    icon: "camera",
    label: "Instagram",
    href: "https://www.instagram.com/thefinepixel/",
  },
  { icon: "mail", label: "Email", href: "mailto:support@thefinepixel.com" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full max-w-full min-w-0 overflow-x-clip border-t border-outline-variant bg-surface-container-lowest px-margin-mobile pt-16 pb-28 md:px-margin-desktop md:pt-section-gap md:pb-12">
      <div className="mx-auto grid max-w-container-max min-w-0 grid-cols-1 gap-12 md:grid-cols-12 md:gap-gutter">
        <div className="md:col-span-4">
          <Link
            href="/"
            aria-label="The Fine Pixel home"
            className="mb-6 inline-flex text-primary"
          >
            <BrandLogo imageClassName="h-14 w-14" />
          </Link>
          <p className="mb-8 max-w-xs font-body-md text-on-surface-variant">
            Crafting premium stationery for the discerning creative since 2024.
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL.map((item) => (
              <a
                key={item.icon}
                href={item.href}
                aria-label={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="inline-flex h-11 items-center gap-2 rounded-full border border-outline-variant px-3.5 font-caption text-on-surface-variant transition-all hover:border-primary hover:bg-primary hover:text-white"
              >
                <MaterialIcon name={item.icon} className="text-[20px]" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:col-span-8 md:grid-cols-3 md:gap-gutter">
          {LINK_COLS.map((col) => (
            <div key={col.title} className="min-w-0">
              <h4 className="mb-5 font-label-md text-label-md uppercase tracking-wider text-primary">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        className="block font-body-md leading-snug text-on-surface-variant underline-offset-4 transition-colors hover:text-secondary hover:underline hover:decoration-secondary"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block font-body-md leading-snug text-on-surface-variant underline-offset-4 transition-colors hover:text-secondary hover:underline hover:decoration-secondary"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-container-max flex-col items-center justify-between gap-4 border-t border-outline-variant pt-12 text-center md:mt-20 md:flex-row md:gap-6 md:text-left">
        <p className="font-label-md text-on-surface-variant">
          © {new Date().getFullYear()} The Fine Pixel. Crafted for the Discerning
          Creative.
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-secondary" />
          <p className="font-caption text-on-surface-variant">
            Available for shipping in India only
          </p>
        </div>
      </div>
    </footer>
  );
}
