"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MaterialIcon } from "@/components/shared/material-icon";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-on-surface">
        <MaterialIcon name="error" className="mb-4 text-4xl text-primary" />
        <h1 className="mb-3 font-serif text-3xl text-primary">
          Something went wrong
        </h1>
        <p className="mb-8 max-w-md text-on-surface-variant">
          Please try again, or head back home while we sort this out.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-on-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-outline-variant px-6 py-3 font-medium text-primary"
          >
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
