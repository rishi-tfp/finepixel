import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MaterialIcon } from "@/components/shared/material-icon";
import {
  getWhatsAppOrderUrl,
  WHATSAPP_QUOTE_MESSAGE,
} from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Corporate & Bulk Orders",
  description:
    "Premium customized notebooks for teams, clients, events, welcome kits, and institutional gifting.",
};

const CORPORATE_EMAIL = "support@thefinepixel.com";

const SOLUTIONS = [
  "Company logo embossing or printing",
  "Employee names or initials",
  "Custom cover designs",
  "Event branding",
  "Conference and seminar notebooks",
  "Corporate gifting",
  "Welcome kits",
  "Client appreciation gifts",
  "Educational institution orders",
] as const;

const DESIGN_OPTIONS = [
  "Logo placement",
  "Cover artwork",
  "Foil embossing",
  "Custom inserts",
  "Packaging solutions",
  "Colour customization",
] as const;

const PRICING_FACTORS = [
  "Quantity",
  "Product selection",
  "Customization requirements",
  "Packaging preferences",
  "Delivery location",
] as const;

const TIMELINES = [
  { label: "Small Bulk Orders", value: "5–10 business days" },
  { label: "Large Corporate Orders", value: "7–20 business days" },
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

export default function CorporateOrdersPage() {
  const whatsappUrl =
    getWhatsAppOrderUrl(WHATSAPP_QUOTE_MESSAGE) ??
    `https://api.whatsapp.com/send?text=${encodeURIComponent(WHATSAPP_QUOTE_MESSAGE)}`;

  return (
    <>
      <SiteHeader variant="product" />
      <main className="pb-28 pt-24 md:pb-0 md:pt-32">
        <section className="relative overflow-hidden border-b border-outline-variant/40 bg-surface-container-low">
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-margin-mobile py-14 text-center md:px-margin-desktop md:py-20">
            <p className="mb-4 font-label-md text-xs uppercase tracking-[0.22em] text-secondary">
              Corporate
            </p>
            <h1 className="mb-5 font-headline-lg text-headline-lg text-primary md:text-[40px] md:leading-tight">
              Corporate &amp; Bulk Orders
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-on-surface-variant">
              Whether you&apos;re welcoming new employees, thanking valued
              clients, hosting an event, or celebrating your team, The Fine
              Pixel offers premium notebooks designed to leave a lasting
              impression.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid items-start gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="business_center" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Corporate Solutions
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We offer customization options including:
                </p>
                <PolicyList items={SOLUTIONS} icon="workspace_premium" />
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="stacks" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Minimum Order Quantity
                </h2>
              </div>
              <div className="space-y-4">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We accommodate both small and large bulk orders.
                </p>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Special pricing is available based on order quantity,
                  customization requirements, and product selection.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="palette" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Design &amp; Personalization
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Our team will assist you throughout the customization process.
                  Available options include:
                </p>
                <PolicyList items={DESIGN_OPTIONS} icon="brush" />
                <p className="font-caption italic text-on-surface-variant">
                  A digital design preview may be shared for approval before
                  production begins.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="local_shipping" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Production &amp; Delivery
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Production timelines depend on order size and customization
                  requirements. Estimated production time:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {TIMELINES.map((item) => (
                    <li
                      key={item.label}
                      className="flex flex-col gap-1 rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-label-md text-label-md text-primary">
                        {item.label}
                      </span>
                      <span className="font-body-md text-on-surface-variant">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  If your order is for a specific event or occasion, we
                  recommend contacting us well in advance.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="payments" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Pricing
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Every corporate order is unique. Pricing depends on:
                </p>
                <PolicyList items={PRICING_FACTORS} icon="sell" />
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Contact us for a personalized quotation.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="verified" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Quality Commitment
                </h2>
              </div>
              <div>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Every notebook undergoes careful quality checks before
                  dispatch. We are committed to delivering products that reflect
                  premium craftsmanship and attention to detail.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:col-span-2 md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="support_agent" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Contact Us
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  For corporate enquiries or bulk orders, we&apos;d love to hear
                  from you. Our team will be happy to discuss your requirements
                  and provide a customized quotation.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`mailto:${CORPORATE_EMAIL}?subject=Corporate%20%26%20Bulk%20Order%20Enquiry`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90"
                  >
                    <MaterialIcon name="mail" className="text-[18px]" />
                    Email Us
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant px-6 py-3.5 font-label-md text-primary transition-colors hover:border-primary"
                  >
                    <MaterialIcon name="chat" className="text-[18px]" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-14 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-6 py-8 text-center md:px-10">
            <p className="mb-5 font-body-md text-on-surface-variant">
              Ready to plan your next corporate order?
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
              >
                Request a Quote
              </a>
              <Link
                href="/collections"
                className="inline-flex w-full items-center justify-center rounded-lg border border-outline-variant px-8 py-3.5 font-label-md text-primary transition-colors hover:border-primary sm:w-auto"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
