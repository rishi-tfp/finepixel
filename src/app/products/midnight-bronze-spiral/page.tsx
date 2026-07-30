import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Midnight Bronze Spiral",
};

export default function MidnightBronzeSpiralPage() {
  redirect("/products/midnight-bronze-spiral");
}
