import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductDetail } from "@/components/product/product-detail";
import {
  fetchJudgemeProductReviews,
  shopifyProductNumericId,
} from "@/lib/judgeme";
import { getAllProducts, getProductBySlug } from "@/lib/product-source";
import { getSiteUrl, productJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  if (!product) return { title: "Product" };

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/products/${product.handle}`;
  const images = product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : undefined;

  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.title,
      description: product.description,
      url,
      type: "website",
      images: images?.map((src) => ({ url: src })),
    },
  };
}

export default async function ProductHandlePage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  if (!product) notFound();

  const jsonLd = productJsonLd(product);
  let relatedProducts: Awaited<ReturnType<typeof getAllProducts>> = [];
  try {
    const catalog = await getAllProducts();
    relatedProducts = catalog
      .filter((item) => item.handle !== product.handle && item.available)
      .slice(0, 4);
  } catch {
    relatedProducts = [];
  }

  const externalId = shopifyProductNumericId(product.shopifyId ?? product.id);
  const judgemeReviews = externalId
    ? await fetchJudgemeProductReviews(externalId)
    : null;

  return (
    <>
      <SiteHeader variant="product" />
      <main className="mx-auto w-full min-w-0 max-w-container-max px-margin-mobile pb-28 pt-24 md:px-margin-desktop md:pb-section-gap md:pt-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <ProductDetail
          product={product}
          relatedProducts={relatedProducts}
          judgemeReviews={judgemeReviews}
        />
      </main>
      <SiteFooter />
    </>
  );
}
