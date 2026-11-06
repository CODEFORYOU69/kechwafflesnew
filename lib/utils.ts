import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Declares the design system's type scale: left alone, tailwind-merge reads `text-eyebrow`
// as a text colour and drops it next to `text-gold-400`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["mega", "hero", "section", "headline", "subhead", "eyebrow"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
