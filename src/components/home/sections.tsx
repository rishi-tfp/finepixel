import Link from "next/link";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { MaterialIcon } from "@/components/shared/material-icon";
import { images } from "@/lib/images";
import {
  getWhatsAppOrderUrl,
  WHATSAPP_QUOTE_MESSAGE,
} from "@/lib/whatsapp";

export { CustomizerSection } from "@/components/home/customizer-section";

export function HomeHero() {
  return (
    <section className="relative mx-auto max-w-container-max overflow-hidden md:flex md:min-h-[921px] md:items-center md:px-margin-desktop md:py-section-gap">
      <div className="flex w-full flex-col md:grid md:grid-cols-12 md:items-center md:gap-gutter">
        <div className="z-10 space-y-6 px-margin-mobile pt-8 pb-10 md:col-span-6 md:space-y-0 md:px-0 md:pt-0 md:pb-0">
          <span className="mb-0 block font-label-md text-label-md tracking-[0.2em] text-secondary uppercase md:mb-4">
            New Atelier Release
          </span>
          <h1 className="font-display-lg text-display-lg-mobile leading-tight md:mb-6 md:text-display-lg">
            Designed to Capture Brilliant Ideas.
          </h1>
          <p className="max-w-lg font-body-lg text-body-lg text-on-surface-variant md:mb-10">
            Premium notebooks crafted for students, professionals and creators
            who appreciate thoughtful design and tactile excellence.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <Link
              href="/collections"
              className="premium-lift w-full rounded-lg bg-primary px-10 py-4 text-center font-label-md text-on-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl md:w-auto"
            >
              Shop Collection
            </Link>
            <Link
              href="/#customizer"
              className="premium-lift w-full rounded-lg border border-primary px-10 py-4 text-center font-label-md text-primary transition-all hover:bg-primary hover:text-on-primary md:w-auto"
            >
              Customize Yours
            </Link>
          </div>
        </div>
        <div className="relative w-full px-margin-mobile md:col-span-6 md:mt-0 md:px-0">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-xl md:shadow-2xl">
            <OptimizedImage
              src={images.homeHero}
              alt="Fine Pixel navy notebook with gold foil branding on a sunlit desk, beside a handwritten journal and a Write Focus Grow mug."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden max-w-[200px] rounded-xl border border-outline-variant/10 bg-white p-6 shadow-lg lg:block">
            <p className="font-caption italic text-on-surface-variant">
              &ldquo;The texture of the paper is unparalleled for sketching.&rdquo;
            </p>
            <p className="mt-2 font-label-md">— Julian V, Architect</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Curated Series temporarily hidden — homepage uses Atelier Drop instead. */

const qualities = [
  {
    icon: "description",
    title: "Premium Writing Paper",
    desc: "Acid-free, bleed-resistant cream paper for a smooth writing experience.",
  },
  {
    icon: "auto_awesome",
    title: "Gloss/Matte Finishes",
    desc: "Choose the haptic response that fits your unique aesthetic style.",
  },
  {
    icon: "link",
    title: "Metallic Binding",
    desc: "Durable twin-wire binding allows your book to lay perfectly flat.",
  },
  {
    icon: "space_dashboard",
    title: "Minimal Aesthetic",
    desc: "Clean layouts that eliminate distractions and foster deep focus.",
  },
  {
    icon: "edit_note",
    title: "Personalisation",
    desc: "Custom foil stamping and bespoke layouts tailored to you.",
  },
  {
    icon: "search_check",
    title: "Attention to Detail",
    desc: "Hand-inspected for perfection at every stage of the journey.",
  },
] as const;

export function EssenceOfQuality() {
  return (
    <section className="bg-surface-container-lowest py-16 md:py-section-gap">
      <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
          <h2 className="mb-6 font-headline-lg text-headline-lg">
            The Essence of Quality
          </h2>
          <p className="mx-auto max-w-xs font-body-md text-on-surface-variant md:max-w-none">
            Every element of our stationery is chosen with uncompromising
            standards to ensure your thoughts are preserved with the dignity
            they deserve.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-12 md:gap-y-16">
          {qualities.map((q) => (
            <div key={q.title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/10 bg-background md:mb-6 md:h-16 md:w-16 md:shadow-sm">
                <MaterialIcon
                  name={q.icon}
                  className="text-xl text-primary md:text-3xl"
                />
              </div>
              <h4 className="mb-2 font-label-md text-label-md">{q.title}</h4>
              <p className="font-caption text-on-surface-variant">{q.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const lifestyle = [
  { src: images.lifestyle1, alt: "Aesthetic desk setup with notebook and coffee." },
  { src: images.lifestyle2, alt: "Close up of a hand writing in an open notebook." },
  { src: images.lifestyle3, alt: "Bright artist's studio with sketchbooks." },
  { src: images.lifestyle4, alt: "Organized flat-lay of creative professional gear." },
  { src: images.lifestyle5, alt: "Stack of colorful minimalist notebooks." },
  { src: images.lifestyle6, alt: "Minimalist library study nook with notebook." },
] as const;

export function LifestyleGallery() {
  return (
    <section className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop md:py-section-gap">
      <h2 className="mb-8 text-center font-headline-lg text-headline-lg md:mb-16">
        Inspired Spaces
      </h2>
      <div className="masonry-mobile md:hidden">
        {lifestyle.map((item) => (
          <OptimizedImage
            key={`m-${item.src}`}
            src={item.src}
            alt={item.alt}
            width={600}
            height={750}
            sizes="50vw"
            className="w-full rounded-xl shadow-sm"
          />
        ))}
      </div>
      <div className="masonry hidden md:block">
        {lifestyle.map((item) => (
          <div key={item.src} className="mb-6 break-inside-avoid">
            <OptimizedImage
              src={item.src}
              alt={item.alt}
              width={600}
              height={750}
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="w-full cursor-pointer rounded-2xl shadow-sm transition-opacity hover:opacity-90"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function CorporateGifting() {
  return (
    <section
      id="corporate"
      className="relative flex min-h-[500px] items-center overflow-hidden md:min-h-[614px]"
    >
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={images.corporateBanner}
          alt="A professional modern office setting with Fine Pixel corporate notebooks on a conference table."
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile py-12 text-center md:px-margin-desktop md:py-0 md:text-left">
        <div className="mx-auto max-w-2xl space-y-6 md:mx-0 md:space-y-0">
          <h2 className="font-headline-lg text-headline-lg text-white md:mb-6">
            Elevate Your Corporate Identity
          </h2>
          <p className="font-body-lg text-white/80 md:mb-10">
            Bespoke stationery solutions for modern brands. From custom cover
            colors to internal page layouts and bulk personalization.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-4">
            <a
              href={
                getWhatsAppOrderUrl(WHATSAPP_QUOTE_MESSAGE) ??
                "https://api.whatsapp.com/send?text=" +
                  encodeURIComponent(WHATSAPP_QUOTE_MESSAGE)
              }
              target="_blank"
              rel="noopener noreferrer"
              className="premium-lift inline-flex h-auto w-full items-center justify-center rounded-lg bg-white px-10 py-4 font-label-md text-primary transition-all hover:bg-secondary-fixed hover:text-primary md:w-auto"
            >
              Request a Quote
            </a>
            <Link
              href="/corporate"
              className="premium-lift inline-flex h-auto w-full items-center justify-center rounded-lg border border-white/40 px-10 py-4 font-label-md text-white transition-all hover:bg-white/10 md:w-auto"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section
      className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop md:py-section-gap"
      id="studio"
    >
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <div className="relative order-1 space-y-8 md:space-y-0">
          <div className="absolute -top-10 -left-10 hidden h-40 w-40 rounded-full bg-secondary/10 blur-3xl md:block" />
          <h2 className="font-headline-lg text-headline-lg md:mb-8">
            Our Philosophy of Craft
          </h2>
          <div className="space-y-6 font-body-md text-on-surface-variant">
            <p>
              At The Fine Pixel, we believe that the tools you use define the
              clarity of your thoughts. Born from a small design studio, we set
              out to create the perfect balance between tactile tradition and
              modern utility.
            </p>
            <p>
              Every notebook is more than just paper—it is a sanctuary for your
              most brilliant ideas, your sketches, and your life&apos;s goals.
              We obsess over the details so you can focus on the work that
              matters.
            </p>
            <p>
              Our commitment to sustainability means using ethically sourced
              materials and minimizing our footprint, ensuring that your legacy
              is as kind to the planet as it is inspiring to you.
            </p>
          </div>
        </div>
        <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl shadow-xl md:rounded-3xl">
          <OptimizedImage
            src={images.aboutCraft}
            alt="A black and white close-up photograph of a craftsman's hands carefully inspecting luxury notebook covers."
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

const INSTAGRAM_URL = "https://www.instagram.com/thefinepixel/";

const igPosts = [
  { src: images.ig1, alt: "Instagram post showing a flatlay of a notebook and a coffee cup." },
  { src: images.ig2, alt: "Instagram post showing a personalized notebook with gold lettering." },
  { src: images.ig3, alt: "Instagram post showing a clean studio space with stationery." },
  { src: images.ig4, alt: "Instagram post of a person sketching in a designer notebook." },
  { src: images.ig5, alt: "Instagram post showing a stack of colorful student essentials." },
  { src: images.ig6, alt: "Instagram post showing a minimalist office desk with a laptop and notebook." },
] as const;

export function InstagramSection() {
  return (
    <section className="md:py-section-gap">
      <div className="mx-auto mb-8 flex max-w-container-max min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-margin-mobile md:mb-12 md:px-margin-desktop">
        <h2 className="min-w-0 font-headline-md text-headline-md">
          @thefinepixel
        </h2>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-label-md text-secondary hover:underline"
        >
          Follow Our Journey
        </a>
      </div>
      <div className="grid grid-cols-3 gap-1 md:grid-cols-6 md:gap-2">
        {igPosts.map((post) => (
          <a
            key={post.src}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden"
            aria-label="Open @thefinepixel on Instagram"
          >
            <OptimizedImage
              src={post.src}
              alt={post.alt}
              fill
              sizes="(max-width: 768px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <MaterialIcon name="favorite" className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const communityHref =
    getWhatsAppOrderUrl(
      "Hi! I'd like to join The Fine Pixel creative community and hear about new releases.",
    ) ??
    "mailto:support@thefinepixel.com?subject=Join%20the%20creative%20community";

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop md:py-section-gap">
      <div className="rounded-3xl bg-primary p-6 text-center text-on-primary sm:p-10 md:p-20">
        <h2 className="mb-6 font-headline-lg text-headline-lg">
          Join Our Creative Community
        </h2>
        <p className="mx-auto mb-8 max-w-xl font-body-md text-on-primary-container md:mb-12">
          Message us for early looks at atelier releases, creative prompts, and
          design stories — we reply personally.
        </p>
        <a
          href={communityHref}
          target="_blank"
          rel="noopener noreferrer"
          className="premium-lift inline-flex h-auto items-center justify-center rounded-lg bg-white px-8 py-4 font-label-md text-primary transition-colors hover:bg-secondary-fixed hover:text-primary"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}
