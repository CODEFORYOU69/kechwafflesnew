import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

type Props = {
  title: string;
  subtitle: string;
  visualBrief: string;
};

export const BehindScenes: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const tagOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });
  const grainOpacity = 0.06;

  const letters = title.split("");

  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {/* Grain overlay */}
      <AbsoluteFill
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Amber top line */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 80,
          opacity: tagOpacity,
        }}
      >
        <div
          style={{
            color: "#F4A261",
            fontSize: 22,
            letterSpacing: 6,
            fontFamily: "sans-serif",
            textTransform: "uppercase",
          }}
        >
          BEHIND THE SCENES
        </div>
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
        {/* Letter-by-letter title */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 800,
          }}
        >
          {letters.map((letter, i) => {
            const letterOpacity = interpolate(frame, [i * 3, i * 3 + 20], [0, 1], {
              extrapolateRight: "clamp",
            });
            return (
              <span
                key={i}
                style={{
                  color: "white",
                  fontSize: 72,
                  fontFamily: "Georgia, serif",
                  fontWeight: 700,
                  opacity: letterOpacity,
                  letterSpacing: 2,
                  whiteSpace: letter === " " ? "pre" : "normal",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div
          style={{
            color: "#aaa",
            fontSize: 28,
            marginTop: 24,
            fontFamily: "sans-serif",
            textAlign: "center",
            maxWidth: 700,
            opacity: subtitleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {subtitle}
        </div>
      </AbsoluteFill>

      {/* Bottom tag */}
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
            border: "2px solid #F4A261",
            color: "#F4A261",
            padding: "12px 40px",
            borderRadius: 100,
            fontFamily: "Georgia, serif",
            fontSize: 28,
            letterSpacing: 3,
          }}
        >
          KECH WAFFLES
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
