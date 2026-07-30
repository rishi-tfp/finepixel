import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MaterialIcon } from "@/components/shared/material-icon";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of The Fine Pixel website and purchase of notebooks.",
};

const USE_RULES = [
  "Use the site for lawful browsing and ordering only",
  "Provide accurate account and shipping details",
  "Do not attempt to disrupt or misuse the storefront",
  "Respect intellectual property on product designs and brand assets",
] as const;

const ORDER_NOTES = [
  "Prices are shown in INR unless stated otherwise",
  "Orders are confirmed once payment is successfully processed",
  "Personalized items are made to your submitted details",
  "Delivery timelines are estimates and may vary by location",
] as const;

function PolicyList({
  items,
  icon = "check",
}: {
  items: readonly string[];
  icon?: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex min-h-20 items-start gap-2.5 rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-3.5 py-3.5 transition-colors hover:border-secondary/40 hover:bg-surface sm:px-4"
        >
          <MaterialIcon
            name={icon}
            className="mt-0.5 shrink-0 text-[17px] text-secondary"
          />
          <span className="text-sm leading-snug text-on-surface-variant">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsOfServicePage() {
  return (
    <>
      <SiteHeader variant="product" />
      <main className="pb-28 pt-24 md:pb-0 md:pt-32">
        <section className="relative overflow-hidden border-b border-outline-variant/40 bg-surface-container-low">
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-margin-mobile py-14 text-center md:px-margin-desktop md:py-20">
            <p className="mb-4 font-label-md text-xs uppercase tracking-[0.22em] text-secondary">
              Legal
            </p>
            <h1 className="mb-5 font-headline-lg text-headline-lg text-primary md:text-[40px] md:leading-tight">
              Terms of Service
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-on-surface-variant">
              These terms apply when you browse The Fine Pixel or place an
              order for our notebooks and personalized stationery.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="gavel" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Using the Site
                </h2>
              </div>
              <PolicyList items={USE_RULES} />
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="shopping_bag" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Orders &amp; Payment
                </h2>
              </div>
              <PolicyList items={ORDER_NOTES} icon="payments" />
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm md:col-span-2 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="policy" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Related Policies
                </h2>
              </div>
              <p className="mb-5 font-body-md leading-relaxed text-on-surface-variant">
                Shipping, returns, refunds, and privacy are covered in separate
                policies. If anything in those pages conflicts with these
                terms for a specific topic, the dedicated policy controls that
                topic.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shipping"
                  className="rounded-lg border border-outline-variant px-4 py-2 font-label-md text-primary transition-colors hover:border-secondary hover:text-secondary"
                >
                  Shipping
                </Link>
                <Link
                  href="/returns"
                  className="rounded-lg border border-outline-variant px-4 py-2 font-label-md text-primary transition-colors hover:border-secondary hover:text-secondary"
                >
                  Returns &amp; Refunds
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-lg border border-outline-variant px-4 py-2 font-label-md text-primary transition-colors hover:border-secondary hover:text-secondary"
                >
                  Privacy
                </Link>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm md:col-span-2 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="mail" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Questions
                </h2>
              </div>
              <p className="font-body-md leading-relaxed text-on-surface-variant">
                For questions about these terms, contact{" "}
                <a
                  href="mailto:support@thefinepixel.com"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  support@thefinepixel.com
                </a>
                .
              </p>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
