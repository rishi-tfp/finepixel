import Image from "next/image";
import { cn } from "@/lib/utils";

type OptimizedImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

export function OptimizedImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  quality = 85,
}: OptimizedImageProps) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        className={cn(className)}
        priority={priority}
        quality={quality}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 1000}
      sizes={sizes}
      className={cn(className)}
      priority={priority}
      quality={quality}
    />
  );
}
