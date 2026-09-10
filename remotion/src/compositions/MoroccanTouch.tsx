import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

const MOROCCAN = {
  deepGreen: "#1B4332",
  gold: "#D4A017",
  red: "#C1121F",
  cream: "#FFF8EE",
};

type Props = {
  productName: string;
  moroccanIngredient: string;
  caption: string;
  visualBrief: string;
};

// Pre-computed zellige tile positions (40 tiles in a grid pattern)
const TILES = Array.from({ length: 40 }, (_, i) => ({
  x: (i % 8) * 135 + 5,
  y: Math.floor(i / 8) * 135 + 5,
  delay: i * 3,
}));

export const MoroccanTouch: React.FC<Props> = ({
  productName,
  moroccanIngredient,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeScale = spring({ frame, fps, from: 0, to: 1, durationInFrames: 25, delay: 60 });
  const contentOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const arabicOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const arabicScale = spring({ frame, fps, from: 0.7, to: 1, durationInFrames: 30, delay: 40 });

  return (
    <AbsoluteFill style={{ background: MOROCCAN.deepGreen }}>
      {/* Zellige SVG overlay */}
      <AbsoluteFill style={{ opacity: 0.12 }}>
        <svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
          {TILES.map((tile, i) => {
            const tileOpacity = interpolate(
              frame,
              [tile.delay, tile.delay + 15],
              [0, 1],
              { extrapolateRight: "clamp" }
            );
            return (
              <g key={i} transform={`translate(${tile.x}, ${tile.y})`} opacity={tileOpacity}>
                <polygon
                  points="60,0 120,60 60,120 0,60"
                  fill="none"
                  stroke={MOROCCAN.gold}
                  strokeWidth="2"
                />
                <polygon
                  points="60,20 100,60 60,100 20,60"
                  fill="none"
                  stroke={MOROCCAN.gold}
                  strokeWidth="1"
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Gold top border */}
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: `linear-gradient(90deg, transparent, ${MOROCCAN.gold}, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: `linear-gradient(90deg, transparent, ${MOROCCAN.gold}, transparent)`,
          }}
        />
      </AbsoluteFill>

      {/* Center content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: contentOpacity,
        }}
      >
        {/* Waffle emoji placeholder */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 24,
          }}
        >
          🧇
        </div>

        {/* Product name */}
        <div
          style={{
            color: MOROCCAN.cream,
            fontSize: 60,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          {productName}
        </div>

        {/* Arabic/Moroccan ingredient */}
        <div
          style={{
            color: MOROCCAN.gold,
            fontSize: 80,
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            marginTop: 12,
            opacity: arabicOpacity,
            transform: `scale(${arabicScale})`,
            textAlign: "center",
            direction: "rtl",
          }}
        >
          {moroccanIngredient}
        </div>

        {/* Caption */}
        <div
          style={{
            color: "#ccc",
            fontSize: 24,
            marginTop: 24,
            textAlign: "center",
            maxWidth: 700,
            fontFamily: "sans-serif",
            lineHeight: 1.5,
          }}
        >
          {caption?.slice(0, 80)}
        </div>
      </AbsoluteFill>

      {/* "Moroccan Touch" badge */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          padding: 48,
          opacity: contentOpacity,
        }}
      >
        <div
          style={{
            background: MOROCCAN.gold,
            color: MOROCCAN.deepGreen,
            padding: "10px 28px",
            borderRadius: 8,
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            transform: `scale(${badgeScale})`,
          }}
        >
          MOROCCAN TOUCH ✦
        </div>
      </AbsoluteFill>

      {/* Bottom logo */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 56,
          opacity: arabicOpacity,
        }}
      >
        <div
          style={{
            color: MOROCCAN.gold,
            fontFamily: "Georgia, serif",
            fontSize: 28,
            letterSpacing: 4,
          }}
        >
          KECH WAFFLES — مراكش
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
