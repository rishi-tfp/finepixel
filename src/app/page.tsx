import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RevealObserver } from "@/components/shared/reveal-observer";
import { BestSellers } from "@/components/home/community-favorites";
import { ReviewsSection } from "@/components/home/reviews-section";
import {
  HomeHero,
  CuratedSeries,
  EssenceOfQuality,
  CustomizerSection,
  LifestyleGallery,
  CorporateGifting,
  AboutSection,
  InstagramSection,
  NewsletterSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <SiteHeader variant="home" />
      <main className="space-y-20 pb-8 pt-[72px] md:space-y-0 md:pb-0 md:pt-20">
        <HomeHero />
        <CuratedSeries />
        <EssenceOfQuality />
        <BestSellers />
        <CustomizerSection />
        <LifestyleGallery />
        <ReviewsSection />
        <CorporateGifting />
        <AboutSection />
        <InstagramSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
