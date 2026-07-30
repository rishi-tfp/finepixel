import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CollectionsContent } from "@/components/collections/collections-content";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore The Fine Pixel 2024 Archival Collection — refined notebooks designed with FSC-certified paper and artisanal binding.",
};

export default function CollectionsPage() {
  return (
    <>
      <SiteHeader variant="collections" />
      <main className="pb-24 pt-[72px] md:pb-0 md:pt-20">
        <Suspense
          fallback={
            <div className="px-margin-desktop py-section-gap font-body-md text-on-surface-variant">
              Loading collection…
            </div>
          }
        >
          <CollectionsContent />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
