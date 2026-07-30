"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { MaterialIcon } from "@/components/shared/material-icon";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  className?: string;
};

export function CartButton({ className }: CartButtonProps) {
  const { count } = useCart();

  return (
    <Link
      href="/bag"
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-primary transition-opacity hover:opacity-70 active:scale-95",
        className,
      )}
      aria-label={
        count > 0 ? `Shopping bag, ${count} items` : "Shopping bag"
      }
      title={count > 0 ? "View bag" : "Bag is empty"}
    >
      <MaterialIcon name="shopping_bag" className="text-[24px]" />
      {count > 0 ? (
        <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-medium text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
