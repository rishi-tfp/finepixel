"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MaterialIcon } from "@/components/shared/material-icon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-margin-mobile py-20 text-center md:px-margin-desktop">
      <MaterialIcon name="error" className="mb-4 text-4xl text-primary" />
      <h1 className="mb-3 font-headline-lg text-headline-lg text-primary">
        Something went wrong
      </h1>
      <p className="mb-8 font-body-md text-on-surface-variant">
        This page couldn’t load. Try again, or browse the collections.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-6 py-3 font-label-md text-on-primary"
        >
          Try again
        </button>
        <Link
          href="/collections"
          className="rounded-lg border border-outline-variant px-6 py-3 font-label-md text-primary"
        >
          Browse collections
        </Link>
      </div>
    </div>
  );
}
