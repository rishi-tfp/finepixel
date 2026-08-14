import type { Metadata } from "next";
import { DM_Sans, Libre_Caslon_Text, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { PromotionExperience } from "@/components/promotions/promotion-experience";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Fine Pixel | Designed to Capture Brilliant Ideas",
    template: "%s | The Fine Pixel",
  },
  description:
    "Premium notebooks crafted for students, professionals and creators who appreciate thoughtful design and tactile excellence.",
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  icons: {
    icon: "/fine-pixel-logo.png",
    apple: "/fine-pixel-logo.png",
  },
  openGraph: {
    title: "The Fine Pixel | Designed to Capture Brilliant Ideas",
    description:
      "Premium notebooks crafted for students, professionals and creators who appreciate thoughtful design and tactile excellence.",
    type: "website",
    siteName: "The Fine Pixel",
    locale: "en_IN",
    url: siteUrl,
    images: [
      {
        url: "/fine-pixel-logo.png",
        alt: "The Fine Pixel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fine Pixel | Designed to Capture Brilliant Ideas",
    description:
      "Premium notebooks crafted for students, professionals and creators who appreciate thoughtful design and tactile excellence.",
    images: ["/fine-pixel-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${dmSans.variable} ${libreCaslon.variable} ${geistMono.variable} h-full max-w-full scroll-smooth overflow-x-clip antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="flex min-h-full max-w-full flex-col overflow-x-clip bg-background pt-9 text-on-surface font-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <PromotionExperience />
        <CartProvider>
          {children}
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
