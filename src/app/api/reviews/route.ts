import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  listReviews,
  newReviewId,
  saveReview,
  REVIEWS_UPLOAD_DIR,
  type StudioReview,
} from "@/lib/reviews";

export const runtime = "nodejs";

const MAX_PHOTO_BYTES = 2.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionFor(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

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

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const role = String(form.get("role") ?? "").trim();
    const quote = String(form.get("quote") ?? "").trim();
    const ratingRaw = String(form.get("rating") ?? "5");
    const photo = form.get("photo");

    if (!name || name.length > 60) {
      return NextResponse.json(
        { error: "Please enter your name (max 60 characters)." },
        { status: 400 },
      );
    }
    if (!quote || quote.length < 20 || quote.length > 500) {
      return NextResponse.json(
        { error: "Please write a review between 20 and 500 characters." },
        { status: 400 },
      );
    }
    if (role.length > 80) {
      return NextResponse.json(
        { error: "Title / role is too long." },
        { status: 400 },
      );
    }

    const rating = Math.min(5, Math.max(1, Number(ratingRaw) || 5));

    if (!(photo instanceof File) || photo.size === 0) {
      return NextResponse.json(
        { error: "Please upload a photo with your review." },
        { status: 400 },
      );
    }
    if (!ALLOWED_TYPES.has(photo.type)) {
      return NextResponse.json(
        { error: "Photo must be JPG, PNG, WEBP, or GIF." },
        { status: 400 },
      );
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Photo must be under 2.5 MB." },
        { status: 400 },
      );
    }

    const id = newReviewId();
    const filename = `${id}.${extensionFor(photo.type)}`;
    await fs.mkdir(REVIEWS_UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await photo.arrayBuffer());
    await fs.writeFile(path.join(REVIEWS_UPLOAD_DIR, filename), buffer);

    const review: StudioReview = {
      id,
      name,
      role: role || "Fine Pixel customer",
      quote,
      rating,
      photoUrl: `/uploads/reviews/${filename}`,
      createdAt: new Date().toISOString(),
    };

    await saveReview(review);
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("[api/reviews] create failed:", error);
    return NextResponse.json(
      { error: "Could not save your review. Please try again." },
      { status: 500 },
    );
  }
}
