import { promises as fs } from "fs";
import path from "path";

export type StudioReview = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  photoUrl: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
export const REVIEWS_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "reviews",
);

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(REVIEWS_UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(REVIEWS_FILE);
  } catch {
    await fs.writeFile(REVIEWS_FILE, "[]\n", "utf8");
  }
}

export async function listReviews(): Promise<StudioReview[]> {
  await ensureStore();
  const raw = await fs.readFile(REVIEWS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as StudioReview[];
    if (!Array.isArray(parsed)) return [];
    return [...parsed].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  } catch {
    return [];
  }
}

export async function saveReview(review: StudioReview): Promise<StudioReview> {
  await ensureStore();
  const existing = await listReviews();
  const next = [review, ...existing];
  await fs.writeFile(REVIEWS_FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return review;
}

export function newReviewId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
