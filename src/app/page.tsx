import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { RevealObserver } from "@/components/shared/reveal-observer";
import { BestSellers } from "@/components/home/community-favorites";
import { ReviewsSection } from "@/components/home/reviews-section";
import { AtelierDropSection } from "@/components/home/atelier-drop-section";
import {
  HomeHero,
  EssenceOfQuality,
  CustomizerSection,
  LifestyleGallery,
  CorporateGifting,
  AboutSection,
  InstagramSection,
} from "@/components/home/sections";
import { DeliveredMilestone } from "@/components/home/delivered-milestone";

export default function HomePage() {
  return (
    <>
      <SiteHeader variant="home" />
      <main className="min-w-0 max-w-full space-y-12 overflow-x-clip pb-8 pt-[72px] md:space-y-0 md:pb-0 md:pt-20">
        <HomeHero />
        <DeliveredMilestone />
        <AtelierDropSection />
        <BestSellers />
        <EssenceOfQuality />
        <CustomizerSection />
        <LifestyleGallery />
        <ReviewsSection />
        <CorporateGifting />
        <AboutSection />
        <InstagramSection />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
