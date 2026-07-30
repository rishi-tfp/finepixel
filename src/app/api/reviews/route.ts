import { NextResponse } from "next/server";
import { listReviews } from "@/lib/reviews";

export const runtime = "nodejs";

export async function GET() {
  try {
    const reviews = await listReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("[api/reviews] list failed:", error);
    return NextResponse.json(
      { error: "Could not load reviews" },
      { status: 500 },
    );
  }
}

/** Submissions disabled for Vercel launch — filesystem uploads are ephemeral. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Online review submissions are paused for launch. Email support@thefinepixel.com to share your reflection.",
    },
    { status: 503 },
  );
}
