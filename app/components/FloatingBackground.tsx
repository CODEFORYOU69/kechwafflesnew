"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FloatingElementType {
  src: string;
  alt: string;
  key: string;
  x: number;
  scale: number;
  amplitude: number;
  frequency: number;
  duration: number;
  delay: number;
}

const floatingElements = [
  { src: "/images/elements/chocolate.png", alt: "Carreau de chocolat" },
  { src: "/images/elements/pistachio.png", alt: "Pistache" },
  { src: "/images/elements/strawberry.png", alt: "Fraise" },
  { src: "/images/elements/speculoos.png", alt: "Speculoos" },
  { src: "/images/elements/almond.png", alt: "Amande" },
];

function generateRandomPosition(width: number) {
  return {
    x: Math.random() * width,
    y: window.innerHeight * 2 + Math.random() * 1000,
    scale: 0.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    duration: 35 + Math.random() * 25,
    delay: Math.random() * 20,
    amplitude: 50 + Math.random() * 100,
    frequency: 0.1 + Math.random() * 0.2,
  };
}

function FloatingElement({
  src,
  alt,
  initialX,
  scale,
  amplitude,
  frequency,
  duration,
  delay,
  elementId,
}: {
  src: string;
  alt: string;
  initialX: number;
  scale: number;
  amplitude: number;
  frequency: number;
  duration: number;
  delay: number;
  elementId: string;
}) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, duration * 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <motion.div
      key={`${elementId}-${animationKey}`}
      className="absolute"
      initial={{
        x: initialX,
        y: window.innerHeight * 2 + 1000,
        scale,
        rotate: Math.random() * 360,
      }}
      animate={{
        y: -500,
        x: [
          initialX - amplitude / 2,
          initialX + amplitude / 2,
          initialX - amplitude / 2,
        ],
        rotate: [0, 180, 360],
      }}
      transition={{
        y: {
          duration,
          ease: "linear",
          delay,
        },
        x: {
          duration: duration / frequency,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
        },
        rotate: {
          duration: duration,
          ease: "linear",
          delay,
        },
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={48}
        height={48}
        className="object-contain drop-shadow-lg"
        style={{ width: 48 * scale, height: 48 * scale }}
      />
    </motion.div>
  );
}

export default function FloatingBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [elements, setElements] = useState<FloatingElementType[]>([]);

  useEffect(() => {
    const width = window.innerWidth;
    const newElements = floatingElements.flatMap((element, elementIndex) =>
      Array.from({ length: 8 }).map((_, instanceIndex) => {
        const position = generateRandomPosition(width);
        return {
          ...element,
          key: `${elementIndex}-${instanceIndex}`,
          ...position,
        };
      })
    );
    setElements(newElements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 min-h-full">
        {elements.map((element) => (
          <FloatingElement
            key={element.key}
            elementId={element.key}
            src={element.src}
            alt={element.alt}
            initialX={element.x}
            scale={element.scale}
            amplitude={element.amplitude}
            frequency={element.frequency}
            duration={element.duration}
            delay={element.delay}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
