import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Wraps a CTA so it leans towards the cursor. Plain markup: `MotionRuntime` handles
 * the pointer through one delegated listener, on mouse devices only.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  /** Share of the cursor's offset the button follows. */
  strength?: number;
  className?: string;
}) {
  return (
    <span className={cn("magnetic", className)} data-magnetic={strength}>
      {children}
    </span>
  );
}
