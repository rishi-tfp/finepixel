import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BagContent } from "@/components/cart/bag-content";

export const metadata: Metadata = {
  title: "Bag",
  description: "Review the notebooks in your Fine Pixel bag before checkout.",
  robots: { index: false, follow: false },
};

export default function BagPage() {
  return (
    <>
      <SiteHeader variant="product" />
      <main className="mx-auto w-full max-w-container-max min-w-0 px-margin-mobile pb-28 pt-24 md:px-margin-desktop md:pb-section-gap md:pt-32">
        <BagContent />
      </main>
      <SiteFooter />
    </>
  );
}
