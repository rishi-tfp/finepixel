import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MaterialIcon } from "@/components/shared/material-icon";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Processing times, delivery estimates, tracking, and shipping details for Fine Pixel made-to-order notebooks.",
};

const SECTIONS = [
  {
    icon: "schedule",
    title: "Processing Time",
    body: [
      "Personalized orders are typically processed within 3–7 business days after order confirmation.",
      "During festive seasons or high-demand periods, processing may take slightly longer.",
    ],
  },
  {
    icon: "local_shipping",
    title: "Shipping Time",
    body: [
      "Once dispatched, estimated delivery times are:",
    ],
    list: [
      { label: "Metro Cities", value: "2–5 business days" },
      { label: "Other Locations", value: "4–8 business days" },
    ],
    note: "Delivery timelines may vary depending on your location and courier availability.",
  },
  {
    icon: "payments",
    title: "Shipping Charges",
    body: [
      "Shipping charges, if applicable, will be displayed during checkout before payment.",
    ],
  },
  {
    icon: "pin_drop",
    title: "Order Tracking",
    body: [
      "Once your order has been shipped, you will receive a tracking link via email or WhatsApp.",
    ],
  },
  {
    icon: "cloud",
    title: "Delays",
    body: [
      "While we work with trusted courier partners, delays caused by weather conditions, natural disasters, public holidays, or courier operations are beyond our control.",
    ],
  },
  {
    icon: "home_pin",
    title: "Incorrect Address",
    body: [
      "Please ensure your shipping address is accurate. The Fine Pixel cannot be responsible for delays or additional shipping charges due to incorrect or incomplete addresses provided by the customer.",
    ],
  },
] as const;

export default function ShippingPolicyPage() {
  return (
    <>
      <SiteHeader variant="product" />
      <main className="pb-28 pt-24 md:pb-0 md:pt-32">
        <section className="relative overflow-hidden border-b border-outline-variant/40 bg-surface-container-low">
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-margin-mobile py-14 text-center md:px-margin-desktop md:py-20">
            <p className="mb-4 font-label-md text-xs uppercase tracking-[0.22em] text-secondary">
              Support
            </p>
            <h1 className="mb-5 font-headline-lg text-headline-lg text-primary md:text-[40px] md:leading-tight">
              Shipping Policy
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-on-surface-variant">
              Thank you for choosing The Fine Pixel. Every notebook is crafted
              and personalized specifically for you. Because each order is made
              to order, we take extra care to ensure the highest quality before
              shipping.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {SECTIONS.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                    <MaterialIcon name={section.icon} className="text-[20px]" />
                  </span>
                  <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="font-body-md leading-relaxed text-on-surface-variant"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {"list" in section && section.list ? (
                    <ul className="mt-2 grid grid-cols-2 gap-3">
                      {section.list.map((item) => (
                        <li
                          key={item.label}
                          className="flex min-h-20 flex-col justify-center gap-1 rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-3.5 py-3.5 transition-colors hover:border-secondary/40 hover:bg-surface sm:px-4"
                        >
                          <span className="text-sm font-medium leading-snug text-primary">
                            {item.label}
                          </span>
                          <span className="text-sm leading-snug text-on-surface-variant">
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {"note" in section && section.note ? (
                    <p className="font-caption italic text-on-surface-variant">
                      {section.note}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-6 py-8 text-center md:px-10">
            <p className="mb-5 font-body-md text-on-surface-variant">
              Need help with an order already on the way?
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/collections"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
              >
                Continue Shopping
              </Link>
              <Link
                href="/account"
                className="inline-flex w-full items-center justify-center rounded-lg border border-outline-variant px-8 py-3.5 font-label-md text-primary transition-colors hover:border-primary sm:w-auto"
              >
                View Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
