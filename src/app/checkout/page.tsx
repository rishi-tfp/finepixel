import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CheckoutRedirect } from "@/components/checkout/checkout-redirect";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Continue to secure checkout for your Fine Pixel notebooks.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader variant="product" />
      <main className="mx-auto w-full min-w-0 max-w-container-max px-margin-mobile pb-28 pt-24 md:px-margin-desktop md:pb-section-gap md:pt-32">
        <Suspense
          fallback={
            <div className="py-20 text-center font-body-md text-on-surface-variant">
              Preparing checkout…
            </div>
          }
        >
          <CheckoutRedirect />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
