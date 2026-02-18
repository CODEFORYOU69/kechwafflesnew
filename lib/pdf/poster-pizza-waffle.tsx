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
    paddingTop: 50,
    paddingBottom: 120,
    paddingHorizontal: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  pizzaImage: {
    width: 1200,
    height: 1200,
    borderWidth: 8,
    borderColor: colors.gold,
    borderRadius: 30,
    objectFit: "cover",
  },
  sloganFr: {
    fontFamily: "Great Vibes",
    fontSize: 56,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 15,
  },
  sloganArContainer: {
    marginBottom: 20,
  },
  dividerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
});

export function PosterPizzaWaffle() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={250} />
        </View>

        <View style={styles.titleContainer}>
          <BilingualText fr="PIZZA WAFFLES" ar="بيتزا وافل" />
        </View>

        <View style={styles.imageContainer}>
          <Image
            src={`${BASE_URL}/images/menu-items/wafflepizza.png`}
            style={styles.pizzaImage}
            cache
          />
        </View>

        <Text style={styles.sloganFr}>
          {"L'Italie rencontre la Belgique"}
        </Text>

        <View style={styles.sloganArContainer}>
          <SloganDarija text="جربها دابا!" />
        </View>

        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        <View style={styles.priceContainer}>
          <PriceBadge fr="À partir de 30 Dh" ar="من 30 درهم" />
        </View>

        <PosterFooter />
      </Page>
    </Document>
  );
}
