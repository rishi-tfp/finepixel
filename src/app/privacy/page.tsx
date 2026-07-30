import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MaterialIcon } from "@/components/shared/material-icon";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Fine Pixel collects, uses, and protects your personal information.",
};

const COLLECTED = [
  "Name",
  "Email address",
  "Phone number",
  "Shipping and billing address",
  "Payment details (processed securely through payment gateways)",
  "Personalization details submitted by you",
  "Device and browsing information through cookies",
] as const;

const USES = [
  "Process and deliver orders",
  "Create personalized products",
  "Communicate order updates",
  "Respond to customer support requests",
  "Improve our website and services",
  "Send promotional emails (only with your consent)",
] as const;

const SHARE_REASONS = [
  "Process payments",
  "Deliver your order",
  "Provide customer support",
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

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-on-surface-variant">
              Your privacy is important to us. At The Fine Pixel, we collect
              only the information necessary to process your order and improve
              your shopping experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-margin-mobile py-12 md:px-margin-desktop md:py-16">
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="inventory_2" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Information We Collect
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We may collect:
                </p>
                <PolicyList items={COLLECTED} icon="person" />
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="tune" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  How We Use Your Information
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Your information is used to:
                </p>
                <PolicyList items={USES} />
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="lock" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Payment Security
                </h2>
              </div>
              <div>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We do not store your debit or credit card information.
                  Payments are processed securely through trusted third-party
                  payment providers.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="handshake" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Data Sharing
                </h2>
              </div>
              <div className="space-y-5">
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We only share information with trusted partners required to:
                </p>
                <PolicyList items={SHARE_REASONS} icon="group" />
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  We never sell your personal information.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="cookie" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Cookies
                </h2>
              </div>
              <div>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  Our website may use cookies to improve browsing experience,
                  remember preferences, and analyze website traffic.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/35 hover:shadow-md md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface-container-low text-secondary">
                  <MaterialIcon name="verified_user" className="text-[20px]" />
                </span>
                <h2 className="font-headline-md text-[21px] leading-snug text-primary">
                  Your Rights
                </h2>
              </div>
              <div>
                <p className="font-body-md leading-relaxed text-on-surface-variant">
                  You may request access, correction, or deletion of your
                  personal information by contacting us.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-14 rounded-2xl border border-outline-variant/30 bg-surface-container-low px-6 py-8 text-center md:px-10">
            <p className="mb-5 font-body-md text-on-surface-variant">
              Questions about how we handle your data?
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:support@thefinepixel.com?subject=Privacy%20Policy%20Enquiry"
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-8 py-3.5 font-label-md text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
              >
                Contact Us
              </a>
              <Link
                href="/returns"
                className="inline-flex w-full items-center justify-center rounded-lg border border-outline-variant px-8 py-3.5 font-label-md text-primary transition-colors hover:border-primary sm:w-auto"
              >
                Returns Policy
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
