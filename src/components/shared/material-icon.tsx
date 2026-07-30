import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type MaterialIconProps = {
  name: string;
  className?: string;
  fill?: boolean;
  style?: CSSProperties;
};

/**
 * Renders a Material Symbol via font ligature.
 * Requires `.material-symbols-outlined` + loaded Material Symbols font.
 */
export function MaterialIcon({
  name,
  className,
  fill = false,
  style,
}: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        fontVariationSettings: fill
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
        ...style,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
