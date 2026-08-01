"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { MaterialIcon } from "@/components/shared/material-icon";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { cn } from "@/lib/utils";
import type { StudioReview } from "@/lib/reviews";

export function ReviewsSection() {
  const formId = useId();
  const [reviews, setReviews] = useState<StudioReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

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

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!photo) {
      setError("Please upload a photo with your review.");
      return;
    }

    setPending(true);
    try {
      const body = new FormData();
      body.set("name", name);
      body.set("role", role);
      body.set("quote", quote);
      body.set("rating", String(rating));
      body.set("photo", photo);

      const response = await fetch("/api/reviews", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as {
        review?: StudioReview;
        error?: string;
      };

      if (!response.ok || !data.review) {
        setError(data.error ?? "Could not save your review.");
        return;
      }

      setReviews((prev) => [data.review!, ...prev]);
      setName("");
      setRole("");
      setQuote("");
      setRating(5);
      setPhoto(null);
      setSuccess(true);
      setFormOpen(false);
    } catch {
      setError("Could not save your review. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="bg-surface-container-low py-16 md:py-section-gap">
      <div className="mx-auto max-w-container-max md:px-margin-desktop">
        <div className="mb-10 flex flex-col items-center gap-4 px-margin-mobile text-center md:mb-16 md:px-0">
          <h2 className="font-headline-lg text-headline-lg">
            Reflections from the Studio
          </h2>
          <p className="max-w-xl font-body-md text-on-surface-variant">
            Real notes from people who write, sketch, and create with Fine
            Pixel. Share yours with a photo.
          </p>
          <button
            type="button"
            onClick={() => {
              setFormOpen((open) => !open);
              setError(null);
              setSuccess(false);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            <MaterialIcon name="add_a_photo" className="text-[20px]" />
            {formOpen ? "Close form" : "Share your reflection"}
          </button>
        </div>

        {formOpen ? (
          <form
            onSubmit={onSubmit}
            className="mx-margin-mobile mb-12 space-y-5 rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm md:mx-0 md:mb-16 md:p-8"
            aria-labelledby={`${formId}-title`}
          >
            <h3
              id={`${formId}-title`}
              className="font-headline-md text-headline-md text-primary"
            >
              Leave a review
            </h3>
            <p className="font-caption text-on-surface-variant">
              Your name, review, and photo are saved with us and shown below.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Name *
                </span>
                <input
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md outline-none transition-colors focus:border-primary"
                  placeholder="Your name"
                />
              </label>
              <label className="block space-y-2">
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Title / role
                </span>
                <input
                  maxLength={80}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md outline-none transition-colors focus:border-primary"
                  placeholder="e.g. Designer, Student"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Your reflection *
              </span>
              <textarea
                required
                minLength={20}
                maxLength={500}
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full resize-y rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md outline-none transition-colors focus:border-primary"
                placeholder="Tell us what you love about your notebook…"
              />
              <span className="block text-right font-caption text-on-surface-variant">
                {quote.length}/500
              </span>
            </label>

            <div className="space-y-2">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Rating
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={cn(
                        "transition-colors",
                        value <= rating ? "text-secondary" : "text-outline",
                      )}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    >
                      <MaterialIcon name="star" fill={value <= rating} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Photo *
              </span>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-8 transition-colors hover:border-primary">
                <MaterialIcon
                  name="upload"
                  className="text-[28px] text-primary"
                />
                <span className="font-body-md text-on-surface-variant">
                  {photo
                    ? photo.name
                    : "Upload a JPG, PNG, or WEBP (max 2.5 MB)"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setPhoto(file);
                  }}
                />
              </label>
              {photoPreview ? (
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-outline-variant">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Selected review photo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="font-caption text-error">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-primary py-4 font-label-md text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60 md:w-auto md:px-10"
            >
              {pending ? "Saving…" : "Submit review"}
            </button>
          </form>
        ) : null}

        {success ? (
          <p className="mb-8 px-margin-mobile text-center font-body-md text-secondary md:px-0">
            Thank you — your reflection is saved and live below.
          </p>
        ) : null}

        {loading ? (
          <p className="px-margin-mobile text-center font-body-md text-on-surface-variant md:px-0">
            Loading reflections…
          </p>
        ) : reviews.length === 0 ? (
          <p className="px-margin-mobile text-center font-body-md text-on-surface-variant md:px-0">
            No reflections yet. Be the first to share yours.
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
