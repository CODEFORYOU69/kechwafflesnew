import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

/**
 * One depth plane inside a positioned `.parallax-frame`. Stack several with
 * different strengths; a negative strength drifts the other way.
 * Never give an ancestor `overflow: hidden`: it would capture `view()` and freeze
 * the layer. Use `overflow: clip` instead.
 */
export function ParallaxLayer({
  children,
  strength = 8,
  className,
  style,
}: {
  children: ReactNode;
  /** Peak drift, in % of the layer's own height. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const layerStyle = {
    "--parallax": `${strength}%`,
    // Scaled just enough that the drift never uncovers the edges of the frame.
    "--parallax-scale": 1 + (2 * Math.abs(strength)) / 100 + 0.01,
    ...style,
  } as CSSProperties;

  return (
    <div className={cn("parallax-layer", className)} style={layerStyle}>
      {children}
    </div>
  );
}
