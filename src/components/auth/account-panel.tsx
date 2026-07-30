"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export function AccountPanel() {
  const { customer, hydrated, enabled, login, register, logout } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const displayName = useMemo(() => {
    if (!customer) return "";
    return (
      [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
      customer.email
    );
  }, [customer]);

  if (!hydrated) {
    return (
      <div className="py-20 text-center font-body-md text-on-surface-variant">
        Loading account…
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <h1 className="mb-3 font-headline-lg text-headline-lg">Account</h1>
        <p className="font-body-md text-on-surface-variant">
          Account login is temporarily unavailable. Please try again later.
        </p>
      </div>
    );
  }

  if (customer) {
    return (
      <div className="mx-auto max-w-xl space-y-8 py-10">
        <header>
          <h1 className="mb-2 font-headline-lg text-headline-lg">Your Account</h1>
          <p className="font-body-md text-on-surface-variant">
            You&apos;re signed in. Checkout will use this account.
          </p>
        </header>

        <div className="space-y-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-8">
          <div className="flex justify-between gap-4 text-body-md">
            <span className="text-on-surface-variant">Name</span>
            <span className="font-medium text-right">{displayName}</span>
          </div>
          <div className="flex justify-between gap-4 text-body-md">
            <span className="text-on-surface-variant">Email</span>
            <span className="font-medium text-right">{customer.email}</span>
          </div>
          {customer.defaultAddress?.address1 ? (
            <div className="flex justify-between gap-4 text-body-md">
              <span className="text-on-surface-variant">Address</span>
              <span className="max-w-[60%] text-right font-medium">
                {[
                  customer.defaultAddress.address1,
                  customer.defaultAddress.city,
                  customer.defaultAddress.zip,
                  customer.defaultAddress.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/bag"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-6 py-4 font-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            View Bag
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-outline px-6 py-4 font-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result =
      mode === "login"
        ? await login(email, password)
        : await register({ email, password, firstName, lastName });
    if (!result.ok) setError(result.error ?? "Something went wrong");
    setPending(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-8 py-10">
      <header className="text-center">
        <h1 className="mb-2 font-headline-lg text-headline-lg">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="font-body-md text-on-surface-variant">
          Sign in to save your details for a faster checkout.
        </p>
      </header>

      <div className="flex rounded-lg border border-outline-variant p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
          }}
          className={cn(
            "flex-1 rounded-md py-3 font-label-md text-label-md transition-colors",
            mode === "login"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-primary",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setError(null);
          }}
          className={cn(
            "flex-1 rounded-md py-3 font-label-md text-label-md transition-colors",
            mode === "register"
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-primary",
          )}
        >
          Register
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {mode === "register" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">
                First name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-focus w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-body-md"
                autoComplete="given-name"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-focus w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-body-md"
                autoComplete="family-name"
              />
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-focus w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-body-md"
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-on-surface-variant">
            Password
          </label>
          <input
            type="password"
            required
            minLength={5}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-focus w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-body-md"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </div>

        {error ? (
          <p className="font-caption text-error">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary py-4 font-label-md text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
