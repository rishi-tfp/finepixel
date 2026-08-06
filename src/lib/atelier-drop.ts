/**
 * Monthly Atelier Drop — update this object each month before launch.
 * Text showcase with optional product link (no fake order button).
 */
export type AtelierDrop = {
  /** e.g. "August 2026" */
  monthLabel: string;
  status: "Coming soon" | "Coming this month" | "Now available" | "Limited preview";
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  note?: string;
  /** Optional path to product or collections for the title link */
  href?: string;
};

export const ATELIER_DROP: AtelierDrop = {
  monthLabel: "Next release",
  status: "Coming soon",
  title: "A new exclusive design",
  subtitle:
    "We’re finishing a special notebook made only for this drop. It will appear here as soon as it’s ready to shop.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAplStAcROGGeUMfpnKf-U_HYpV4kG6UFYVn9myJL-rd2YukZ4bTyJEJ1sLBL9f9U2F10A2drGnIz9XplZc_7FXGp_Ohr-0zipJ9NoIyBvduwvkeT2HSwSlyGFpUsWQmxVEtT4OaaUKhkmNS8EL2TFAGyv-UZIS1ZdHThdQybBcmZ7O8cEfGFU-tKPTPBId1thRy42TwchSm77utcHVkDbdujxd8dxeXtNVhuxCVW7_CgdIRNJjtF2y",
  imageAlt: "Preview of Fine Pixel notebooks for the upcoming atelier drop.",
  note: "Check back here for the first look — one new design each month.",
};
