import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccountPanel } from "@/components/auth/account-panel";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in or create a Fine Pixel account for a faster checkout.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <SiteHeader variant="product" />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-28 pt-24 md:px-margin-desktop md:pb-section-gap md:pt-32">
        <AccountPanel />
      </main>
      <SiteFooter />
    </>
  );
}
