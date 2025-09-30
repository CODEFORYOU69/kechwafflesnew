"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  squaresClassName?: string;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const [filledSquares, setFilledSquares] = useState<Map<number, boolean>>(
    new Map()
  );

  const handleHover = (index: number) => {
    setFilledSquares((prev) => new Map(prev.set(index, true)));
    setTimeout(() => {
      setFilledSquares((prev) => {
        const newMap = new Map(prev);
        newMap.set(index, false); // Début de la transition vers la disparition
        return newMap;
      });
      setTimeout(() => {
        setFilledSquares((prev) => {
          const newMap = new Map(prev);
          newMap.delete(index); // Suppression finale après la transition
          return newMap;
        });
      }, 3000); // Temps de la transition de disparition
    }, 1000); // Temps avant la disparition progressive
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-white">
      <svg
        width={width * horizontal}
        height={height * vertical}
        className={cn("  ", className)}
        {...props}
      >
        {Array.from({ length: horizontal * vertical }).map((_, index) => {
          const x = (index % horizontal) * width;
          const y = Math.floor(index / horizontal) * height;
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              className={cn(
                "blue-400/30 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000",
                squaresClassName
              )}
              onMouseEnter={() => handleHover(index)}
            />
          );
        })}
      </svg>
      {Array.from(filledSquares.keys()).map((index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        return (
          <Image
            key={index}
            src="/images/brontkdsolo.svg"
            alt="Bron Taekwondo Logo"
            width={width}
            height={height}
            className="absolute"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              opacity: filledSquares.get(index) ? 1 : 0,
              transition: "opacity 3s ease-in-out",
              filter: filledSquares.get(index) ? "blur(0px)" : "blur(10px)",
            }}
          />
        );
      })}
    </div>
  );
}
