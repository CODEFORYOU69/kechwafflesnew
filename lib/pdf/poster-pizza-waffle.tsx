/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  A1_SIZE,
  colors,
  BASE_URL,
  PosterLogo,
  BilingualText,
  PriceBadge,
  PosterFooter,
  SloganDarija,
  GoldDivider,
} from "@/lib/pdf/poster-shared";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  pizzaImage: {
    width: 900,
    height: 900,
    borderWidth: 6,
    borderColor: colors.gold,
    borderRadius: 20,
    objectFit: "cover",
  },
  sloganFr: {
    fontFamily: "Great Vibes",
    fontSize: 52,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 20,
  },
  sloganArContainer: {
    marginBottom: 30,
  },
  dividerContainer: {
    width: "100%",
    marginBottom: 30,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
});

export function PosterPizzaWaffle() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={280} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <BilingualText fr="PIZZA WAFFLES" ar="بيتزا وافل" />
        </View>

        {/* Pizza Waffle Image */}
        <View style={styles.imageContainer}>
          <Image
            src={`${BASE_URL}/images/menu-items/wafflepizza.png`}
            style={styles.pizzaImage}
            cache
          />
        </View>

        {/* French Slogan */}
        <Text style={styles.sloganFr}>
          {"L'Italie rencontre la Belgique"}
        </Text>

        {/* Arabic Darija Slogan */}
        <View style={styles.sloganArContainer}>
          <SloganDarija text="جربها دابا!" />
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Price Badge */}
        <View style={styles.priceContainer}>
          <PriceBadge fr="À partir de 30 Dh" ar="من 30 درهم" />
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
