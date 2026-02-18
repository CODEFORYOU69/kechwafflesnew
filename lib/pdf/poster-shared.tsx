/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.kechwaffles.com";

// Register fonts
Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: `${BASE_URL}/fonts/Montserrat-VariableFont_wght.ttf`,
    },
    {
      src: `${BASE_URL}/fonts/Montserrat-Italic-VariableFont_wght.ttf`,
      fontStyle: "italic",
    },
  ],
});

Font.register({
  family: "Great Vibes",
  src: `${BASE_URL}/fonts/GreatVibes-Regular.ttf`,
});

Font.register({
  family: "Cairo",
  src: `${BASE_URL}/fonts/Cairo-VariableFont.ttf`,
});

// A1 size in points (594mm x 841mm)
export const A1_SIZE: [number, number] = [1683.78, 2383.94];

// Brand colors
export const colors = {
  primary: "#1B5E20",
  gold: "#D4AF37",
  red: "#C62828",
  black: "#1a1a1a",
  white: "#FFFFFF",
  cream: "#FDF5E6",
  lightGray: "#F8F8F8",
  darkGray: "#333333",
  coffeeBean: "#3E2723",
  shotGreen: "#2E7D32",
  canPurple: "#1a1a2e",
  warmPink: "#F8E8E0",
};

export { BASE_URL };

// Shared components

export function PosterLogo({ color = "white", size = 280 }: { color?: "white" | "black"; size?: number }) {
  const src = color === "white"
    ? `${BASE_URL}/images/menu-items/TransparentWhite.png`
    : `${BASE_URL}/images/menu-items/TransparentBlack.jpg`;
  return (
    <Image
      src={src}
      style={{ width: size, height: size, objectFit: "contain" }}
      cache
    />
  );
}

export function BilingualText({
  fr,
  ar,
  frStyle,
  arStyle,
}: {
  fr: string;
  ar: string;
  frStyle?: Record<string, unknown>;
  arStyle?: Record<string, unknown>;
}) {
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 72,
          fontWeight: 700,
          color: colors.white,
          letterSpacing: 6,
          textAlign: "center",
          ...frStyle,
        }}
      >
        {fr}
      </Text>
      <Text
        style={{
          fontFamily: "Cairo",
          fontSize: 52,
          color: colors.gold,
          textAlign: "center",
          ...arStyle,
        }}
      >
        {ar}
      </Text>
    </View>
  );
}

export function PriceBadge({
  fr,
  ar,
  bgColor = colors.red,
}: {
  fr: string;
  ar: string;
  bgColor?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 50,
        alignItems: "center",
        borderWidth: 4,
        borderColor: colors.gold,
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 40,
          fontWeight: 700,
          color: colors.white,
        }}
      >
        {fr}
      </Text>
      <Text
        style={{
          fontFamily: "Cairo",
          fontSize: 32,
          color: colors.gold,
        }}
      >
        {ar}
      </Text>
    </View>
  );
}

export function PosterFooter({ color = colors.white }: { color?: string }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 40,
        left: 60,
        right: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        borderTopWidth: 3,
        borderTopColor: colors.gold,
      }}
    >
      <Text style={{ fontFamily: "Montserrat", fontSize: 22, color }}>
        Kech Waffles - Marrakech
      </Text>
      <Text style={{ fontFamily: "Montserrat", fontSize: 22, color }}>
        @kech_waffles
      </Text>
      <Text style={{ fontFamily: "Montserrat", fontSize: 22, color }}>
        www.kechwaffles.com
      </Text>
    </View>
  );
}

export function SloganDarija({ text, color = colors.gold }: { text: string; color?: string }) {
  return (
    <Text
      style={{
        fontFamily: "Cairo",
        fontSize: 44,
        color,
        textAlign: "center",
      }}
    >
      {text}
    </Text>
  );
}

export function GoldDivider() {
  return (
    <View
      style={{
        height: 4,
        backgroundColor: colors.gold,
        marginVertical: 30,
        marginHorizontal: 80,
        borderRadius: 2,
      }}
    />
  );
}

export function CategoryBanner({ text, bgColor = colors.primary }: { text: string; bgColor?: string }) {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderLeftWidth: 8,
        borderLeftColor: colors.gold,
        marginBottom: 20,
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 36,
          fontWeight: 700,
          color: colors.white,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

export function ProductPriceRow({
  name,
  price,
  textColor = colors.black,
  priceColor = colors.red,
  fontSize = 28,
}: {
  name: string;
  price: string;
  textColor?: string;
  priceColor?: string;
  fontSize?: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize,
          fontWeight: 600,
          color: textColor,
          flex: 1,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize,
          fontWeight: 700,
          color: priceColor,
        }}
      >
        {price}
      </Text>
    </View>
  );
}
