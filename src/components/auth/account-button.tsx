"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/shared/material-icon";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

type AccountButtonProps = {
  className?: string;
};

export function AccountButton({ className }: AccountButtonProps) {
  const { customer, hydrated } = useAuth();
  const label = customer
    ? customer.firstName || customer.email.split("@")[0]
    : "Account";

  return (
    <Link
      href="/account"
      className={cn(
        "inline-flex items-center gap-2 transition-all duration-200 hover:opacity-70",
        className,
      )}
      aria-label={customer ? `Account (${label})` : "Sign in"}
      title={hydrated && customer ? label : "Sign in"}
    >
      <MaterialIcon name="person" />
      {hydrated && customer ? (
        <span className="hidden max-w-[7rem] truncate font-label-md text-label-md lg:inline">
          {label}
        </span>
      ) : null}
    </Link>
  );
}
