import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Our type scale uses named sizes (text-label-md, text-body-md…). Without this,
// tailwind-merge reads them as text colors and drops them next to a real color.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "display-lg-mobile",
            "headline-lg",
            "headline-md",
            "label-md",
            "body-lg",
            "body-md",
            "caption",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
