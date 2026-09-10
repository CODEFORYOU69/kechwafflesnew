import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

const COLORS = {
  green: "#2D6A4F",
  amber: "#F4A261",
  red: "#E63946",
  cream: "#FFF8F0",
};

type Props = {
  productName: string;
  caption: string;
  hashtags: string[];
  visualBrief: string;
};

export const ProductShowcase: React.FC<Props> = ({
  productName,
  caption,
  hashtags,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame, fps, from: 80, to: 0, durationInFrames: 30 });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const logoOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const circleScale = spring({ frame, fps, from: 0.6, to: 1, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.amber}22 0%, ${COLORS.green}33 100%)`,
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity,
        }}
      >
        <div
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.amber}44, transparent)`,
            transform: `scale(${circleScale})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${slideUp}px)`,
          opacity,
        }}
      >
        <div
          style={{
            width: 400,
            height: 400,
            borderRadius: 32,
            background: COLORS.amber + "66",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 120,
            boxShadow: `0 20px 60px ${COLORS.amber}44`,
          }}
        >
          🧇
        </div>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.green,
            marginTop: 32,
            textAlign: "center",
            letterSpacing: -1,
            textShadow: `0 2px 8px ${COLORS.green}33`,
          }}
        >
          {productName}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#555",
            marginTop: 16,
            textAlign: "center",
            maxWidth: 700,
            fontFamily: "sans-serif",
            lineHeight: 1.4,
          }}
        >
          {caption?.slice(0, 80)}
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 60,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            background: COLORS.green,
            color: "white",
            padding: "16px 48px",
            borderRadius: 100,
            fontFamily: "Georgia, serif",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          KECH WAFFLES 🧇
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: 40,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            color: COLORS.amber,
            fontSize: 18,
            textAlign: "right",
            fontFamily: "sans-serif",
          }}
        >
          {hashtags?.slice(0, 3).join(" ")}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
