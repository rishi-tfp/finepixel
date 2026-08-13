import { MaterialIcon } from "@/components/shared/material-icon";
import type { JudgemeProductReviews, JudgemeReview } from "@/lib/judgeme";
import { cn } from "@/lib/utils";

function Stars({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const className =
    size === "lg" ? "text-[28px]" : size === "sm" ? "text-[16px]" : "text-[20px]";
  return (
    <div className="flex items-center gap-0.5 text-secondary" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <MaterialIcon
          key={index}
          name="star"
          fill={index < Math.round(rating)}
          className={cn(
            className,
            index < Math.round(rating) ? undefined : "text-outline-variant",
          )}
        />
      ))}
    </div>
  );
}

function formatReviewDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function JudgemeRatingBadge({
  summary,
  className,
}: {
  summary: JudgemeProductReviews | null | undefined;
  className?: string;
}) {
  if (!summary) return null;

  if (summary.reviewCount <= 0) {
    return (
      <a
        href="#customer-reviews"
        className={cn(
          "mb-4 inline-flex items-center gap-2 font-caption text-on-surface-variant transition-colors hover:text-primary",
          className,
        )}
      >
        <Stars rating={0} size="sm" />
        <span>No reviews yet</span>
      </a>
    );
  }

  return (
    <a
      href="#customer-reviews"
      className={cn(
        "mb-4 inline-flex flex-wrap items-center gap-2 transition-opacity hover:opacity-80",
        className,
      )}
    >
      <Stars rating={summary.averageRating} size="sm" />
      <span className="font-caption text-on-surface-variant">
        {summary.averageRating.toFixed(1)} · {summary.reviewCount}{" "}
        {summary.reviewCount === 1 ? "review" : "reviews"}
      </span>
    </a>
  );
}

function ReviewCard({ review }: { review: JudgemeReview }) {
  const dateLabel = formatReviewDate(review.createdAt);
  return (
    <article className="border-b border-outline-variant/30 py-8 last:border-b-0 sm:border sm:border-outline-variant/20 sm:rounded-2xl sm:bg-surface-container-lowest sm:px-8 sm:py-8 sm:last:border">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Stars rating={review.rating} size="sm" />
        {review.verified ? (
          <span className="inline-flex items-center gap-1 font-caption text-secondary">
            <MaterialIcon name="verified" className="text-[16px]" />
            Verified buyer
          </span>
        ) : null}
      </div>
      {review.title ? (
        <h3 className="mb-2 font-label-md text-label-md text-primary">
          {review.title}
        </h3>
      ) : null}
      {review.body ? (
        <p className="mb-6 font-body-md leading-relaxed text-on-surface-variant">
          &ldquo;{review.body}&rdquo;
        </p>
      ) : null}
      {review.pictures.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {review.pictures.slice(0, 4).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      ) : null}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-label-md text-label-md text-primary">
          {review.reviewerName}
        </p>
        {dateLabel ? (
          <p className="font-caption text-on-surface-variant">{dateLabel}</p>
        ) : null}
      </div>
    </article>
  );
}

export function JudgemeReviewsSection({
  summary,
  className,
}: {
  summary: JudgemeProductReviews | null | undefined;
  className?: string;
}) {
  if (!summary) return null;

  const hasReviews = summary.reviews.length > 0;

  return (
    <section
      id="customer-reviews"
      className={cn(
        "mt-section-gap scroll-mt-28 border-t border-outline-variant/40 pt-12",
        className,
      )}
      aria-label="Customer reviews"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Customer Reviews
          </h2>
          <p className="mt-2 max-w-xl font-body-md text-on-surface-variant">
            Honest notes from customers who received their notebooks.
          </p>
        </div>
        {summary.reviewCount > 0 ? (
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
            <Stars rating={summary.averageRating} size="lg" />
            <div>
              <p className="font-headline-md text-headline-md text-primary">
                {summary.averageRating.toFixed(1)}
              </p>
              <p className="font-caption text-on-surface-variant">
                {summary.reviewCount}{" "}
                {summary.reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {hasReviews ? (
        <div className="grid gap-0 sm:gap-6 md:grid-cols-2">
          {summary.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low/70 px-6 py-14 text-center sm:rounded-2xl">
          <div className="flex justify-center">
            <Stars rating={0} size="md" />
          </div>
          <p className="mt-5 font-headline-md text-headline-md text-primary">
            Be the first to leave a review
          </p>
          <p className="mx-auto mt-3 max-w-md font-body-md text-on-surface-variant">
            After your notebook is delivered, you’ll get a short email invite to
            share your thoughts. Published reviews appear here automatically.
          </p>
        </div>
      )}
    </section>
  );
}
