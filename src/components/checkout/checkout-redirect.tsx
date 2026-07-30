"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { MaterialIcon } from "@/components/shared/material-icon";

export function CheckoutRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrated, count, checkout, isCheckingOut } = useCart();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!hydrated || started.current) return;
    if (count === 0) {
      router.replace("/bag");
      return;
    }

    started.current = true;
    const code = searchParams.get("discount")?.trim() || undefined;

    void (async () => {
      const result = await checkout(code);
      if (!result.ok) {
        setError(result.error ?? "Checkout failed");
      }
    })();
  }, [hydrated, count, checkout, router, searchParams]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <MaterialIcon name="error" className="mb-4 text-4xl text-error" />
        <h1 className="mb-3 font-headline-lg text-headline-lg text-primary">
          Couldn’t start checkout
        </h1>
        <p className="mb-8 font-body-md text-on-surface-variant">{error}</p>
        <Link
          href="/bag"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-label-md text-on-primary"
        >
          Back to bag
          <MaterialIcon name="arrow_forward" className="text-base" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <MaterialIcon
        name="lock"
        className="mb-6 text-4xl text-primary"
      />
      <h1 className="mb-3 font-headline-lg text-headline-lg text-primary">
        Secure checkout
      </h1>
      <p className="font-body-md text-on-surface-variant">
        {isCheckingOut || hydrated
          ? "Redirecting you to secure checkout…"
          : "Preparing your bag…"}
      </p>
    </div>
  );
}
