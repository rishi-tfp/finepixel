import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MaterialIcon } from "@/components/shared/material-icon";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy",
  description:
    "Return, replacement, and refund terms for custom-made Fine Pixel notebooks.",
};

const ELIGIBLE_REASONS = [
  "You receive the wrong product.",
  "The product arrives damaged.",
  "The product contains a manufacturing defect.",
  "The personalization differs from the approved design or details provided by you.",
] as const;

const REQUIRED_DETAILS = [
  "Your order number",
  "Clear photographs of the product",
  "Images of the packaging",
] as const;

const NON_RETURNABLE_REASONS = [
  "Change of mind",
  "Spelling or design approved by the customer",
  "Minor color variations due to screen differences",
  "Normal wear and tear after use",
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

export default function ReturnsPolicyPage() {
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
              Returns &amp; Refunds
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-on-surface-variant">
              At The Fine Pixel, every notebook is custom-made according to
              your specifications.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="edit_note" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Personalized Products
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  As each notebook is uniquely created for you, personalized or
                  customized products cannot be returned, exchanged, or
                  refunded unless:
                </p>
                <PolicyList items={ELIGIBLE_REASONS} />
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="package_2" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Damaged Orders
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  If your order arrives damaged, please contact us within{" "}
                  <strong className="font-semibold text-primary">
                    48 hours of delivery
                  </strong>
                  .
                </p>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Please include:
                </p>
                <PolicyList items={REQUIRED_DETAILS} icon="photo_camera" />
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Our team will review your request and arrange a replacement
                  or refund where applicable.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="block" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Non-Returnable Items
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Returns are not accepted for:
                </p>
                <PolicyList items={NON_RETURNABLE_REASONS} icon="close" />
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="payments" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Refunds
                </h2>
              </div>
              <div>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Approved refunds will be processed to the original payment
                  method within{" "}
                  <strong className="font-semibold text-primary">
                    5–10 business days
                  </strong>{" "}
                  after approval.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-14 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-6 py-8 text-center md:px-10">
            <MaterialIcon
              name="support_agent"
              className="mb-3 text-[30px] text-secondary"
            />
            <h2 className="mb-2 font-headline-md text-headline-md text-primary">
              Need Help With an Order?
            </h2>
            <p className="mx-auto mb-6 max-w-lg font-body-md text-on-surface-variant">
              Keep your order number and supporting photographs ready so our
              team can assist you quickly.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="mailto:support@thefinepixel.com?subject=Returns%20%26%20Refunds%20Enquiry"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
              >
                <MaterialIcon name="mail" className="text-[18px]" />
                Contact Us
              </a>
              <a
                href="mailto:support@thefinepixel.com?subject=Order%20Status%20Enquiry"
                className="inline-flex w-full items-center justify-center rounded-lg border border-outline-variant px-8 py-3.5 font-label-md text-primary transition-colors hover:border-primary sm:w-auto"
              >
                Order Help
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
