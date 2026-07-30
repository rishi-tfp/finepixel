"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/shared/material-icon";
import { OptimizedImage } from "@/components/shared/optimized-image";
import type { StudioReview } from "@/lib/reviews";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<StudioReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { reviews?: StudioReview[] } | null) => {
        if (cancelled || !data?.reviews) return;
        setReviews(data.reviews);
      })
      .catch(() => {
        /* keep empty */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-surface-container-low py-16 md:py-section-gap">
      <div className="mx-auto max-w-container-max md:px-margin-desktop">
        <div className="mb-10 flex flex-col items-center gap-4 px-margin-mobile text-center md:mb-16 md:px-0">
          <h2 className="font-headline-lg text-headline-lg">
            Reflections from the Studio
          </h2>
          <p className="max-w-xl font-body-md text-on-surface-variant">
            Real notes from people who write, sketch, and create with Fine
            Pixel.
          </p>
          <a
            href="mailto:support@thefinepixel.com?subject=My%20Fine%20Pixel%20reflection"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            <MaterialIcon name="mail" className="text-[20px]" />
            Share your reflection by email
          </a>
        </div>

        {loading ? (
          <p className="px-margin-mobile text-center font-body-md text-on-surface-variant md:px-0">
            Loading reflections…
          </p>
        ) : reviews.length === 0 ? (
          <p className="px-margin-mobile text-center font-body-md text-on-surface-variant md:px-0">
            Reflections will appear here as our community grows.
          </p>
        ) : (
          <div className="hide-scrollbar flex gap-gutter overflow-x-auto px-margin-mobile md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="w-80 flex-shrink-0 rounded-2xl border border-outline-variant/10 bg-white p-8 shadow-sm md:w-auto md:p-10"
              >
                <div className="mb-6 flex text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MaterialIcon
                      key={i}
                      name="star"
                      fill={i < review.rating}
                      className={
                        i < review.rating ? undefined : "text-outline"
                      }
                    />
                  ))}
                </div>
                <p className="mb-8 font-body-md italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-surface-container">
                    {review.photoUrl ? (
                      <OptimizedImage
                        src={review.photoUrl}
                        alt={`${review.name} photo`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h5 className="font-label-md text-label-md">
                      {review.name}
                    </h5>
                    <p className="font-caption text-on-surface-variant">
                      {review.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
