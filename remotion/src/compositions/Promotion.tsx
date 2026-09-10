import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

const COLORS = {
  red: "#E63946",
  white: "#FFFFFF",
  amber: "#F4A261",
  green: "#2D6A4F",
};

// Pre-computed confetti positions
const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  x: 80 + (i * 47) % 920,
  y: 80 + (i * 73) % 920,
  size: 12 + (i % 4) * 8,
  color: i % 3 === 0 ? COLORS.amber : i % 3 === 1 ? COLORS.green : COLORS.red,
  delay: i * 5,
}));

type Props = {
  offerText: string;
  caption: string;
  hashtags: string[];
};

export const Promotion: React.FC<Props> = ({ offerText, caption, hashtags }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    durationInFrames: 20,
    config: { damping: 8, stiffness: 200 },
  });

  const offerOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" });
  const offerY = interpolate(frame, [15, 40], [20, 0], { extrapolateRight: "clamp" });
  const captionOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const tagOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });

  // Flash effect at frame 5
  const flashOpacity = interpolate(frame, [3, 6, 9], [0, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: COLORS.white }}>
      {/* Flash */}
      <AbsoluteFill
        style={{
          background: COLORS.red,
          opacity: flashOpacity,
        }}
      />

      {/* Confetti dots */}
      <AbsoluteFill>
        {CONFETTI.map((dot, i) => {
          const dotOpacity = interpolate(
            frame,
            [dot.delay, dot.delay + 20],
            [0, 0.7],
            { extrapolateRight: "clamp" }
          );
          const dotY = interpolate(frame, [dot.delay, 150], [dot.y - 30, dot.y + 60], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.x,
                top: dotY,
                width: dot.size,
                height: dot.size,
                borderRadius: "50%",
                background: dot.color,
                opacity: dotOpacity,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* OFFRE badge */}
        <div
          style={{
            background: COLORS.red,
            color: COLORS.white,
            padding: "20px 60px",
            borderRadius: 20,
            fontFamily: "Georgia, serif",
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: 4,
            transform: `scale(${badgeScale})`,
            boxShadow: `0 12px 40px ${COLORS.red}66`,
          }}
        >
          OFFRE
        </div>

        {/* Offer text */}
        <div
          style={{
            fontSize: 52,
            fontFamily: "Georgia, serif",
            fontWeight: 800,
            color: COLORS.green,
            marginTop: 32,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.2,
            opacity: offerOpacity,
            transform: `translateY(${offerY}px)`,
          }}
        >
          {offerText}
        </div>

        {/* Caption */}
        <div
          style={{
            fontSize: 28,
            color: "#555",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 700,
            fontFamily: "sans-serif",
            lineHeight: 1.5,
            opacity: captionOpacity,
          }}
        >
          {caption}
        </div>

        {/* Hashtags */}
        <div
          style={{
            marginTop: 20,
            color: COLORS.amber,
            fontSize: 20,
            fontFamily: "sans-serif",
            opacity: captionOpacity,
          }}
        >
          {hashtags?.slice(0, 3).join("  ")}
        </div>
      </AbsoluteFill>

      {/* Bottom logo */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 60,
          opacity: tagOpacity,
        }}
      >
        <div
          style={{
            background: COLORS.green,
            color: COLORS.white,
            padding: "14px 48px",
            borderRadius: 100,
            fontFamily: "Georgia, serif",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          KECH WAFFLES 🧇
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
