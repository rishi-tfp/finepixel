import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  showName = true,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/fine-pixel-logo.png"
        alt=""
        width={225}
        height={225}
        priority
        className={cn("h-9 w-9 shrink-0 object-contain", imageClassName)}
      />
      {showName ? (
        <span className="whitespace-nowrap font-headline-md font-bold tracking-tight">
          The Fine Pixel
        </span>
      ) : (
        <span className="sr-only">The Fine Pixel</span>
      )}
    </span>
  );
}
