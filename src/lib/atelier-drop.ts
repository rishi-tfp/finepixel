/**
 * Monthly Atelier Drop — update this object each month before launch.
 * Showcase only (no CTA button). Swap `image` for a clear product photo each drop.
 */
export type AtelierDrop = {
  /** e.g. "August 2026" */
  monthLabel: string;
  status: "Coming this month" | "Now available" | "Limited preview";
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  note?: string;
};

export const ATELIER_DROP: AtelierDrop = {
  monthLabel: "August 2026",
  status: "Coming this month",
  title: "Midnight Bronze Spiral",
  subtitle:
    "A quiet dark cover with warm bronze foil — unveiled here before it arrives in the shop.",
  // Clear product-forward photo (replace monthly)
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAplStAcROGGeUMfpnKf-U_HYpV4kG6UFYVn9myJL-rd2YukZ4bTyJEJ1sLBL9f9U2F10A2drGnIz9XplZc_7FXGp_Ohr-0zipJ9NoIyBvduwvkeT2HSwSlyGFpUsWQmxVEtT4OaaUKhkmNS8EL2TFAGyv-UZIS1ZdHThdQybBcmZ7O8cEfGFU-tKPTPBId1thRy42TwchSm77utcHVkDbdujxd8dxeXtNVhuxCVW7_CgdIRNJjtF2y",
  imageAlt:
    "Clear product preview of the Midnight Bronze Spiral notebook — next atelier drop.",
  note: "New designs are unveiled here each month before they go live.",
};
