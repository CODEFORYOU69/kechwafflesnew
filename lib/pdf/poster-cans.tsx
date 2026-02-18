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
  PosterFooter,
  SloganDarija,
  GoldDivider,
} from "@/lib/pdf/poster-shared";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.canPurple,
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
    marginBottom: 20,
  },
  photoGrid: {
    alignItems: "center",
    marginBottom: 10,
  },
  photoRow: {
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
    marginBottom: 30,
  },
  canImage: {
    width: 450,
    height: 450,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  priceLine: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  priceLabel: {
    fontFamily: "Montserrat",
    fontSize: 32,
    color: colors.white,
  },
  priceValue: {
    fontFamily: "Montserrat",
    fontSize: 32,
    fontWeight: 700,
    color: colors.gold,
  },
  sloganContainer: {
    marginBottom: 30,
  },
});

export function PosterCans() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={220} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <BilingualText fr="NOS CANS" ar="الكان ديالنا" />
        </View>

        {/* Gold Divider */}
        <GoldDivider />

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {/* Row 1 */}
          <View style={styles.photoRow}>
            <Image
              src={`${BASE_URL}/images/menu-items/ticanoreo.png`}
              style={styles.canImage}
              cache
            />
            <Image
              src={`${BASE_URL}/images/menu-items/ticanfraise.png`}
              style={styles.canImage}
              cache
            />
            <Image
              src={`${BASE_URL}/images/menu-items/ticancaramel.png`}
              style={styles.canImage}
              cache
            />
          </View>

          {/* Row 2 */}
          <View style={styles.photoRow}>
            <Image
              src={`${BASE_URL}/images/menu-items/ticanbueno.png`}
              style={styles.canImage}
              cache
            />
            <Image
              src={`${BASE_URL}/images/menu-items/dubaichocolatecan.png`}
              style={styles.canImage}
              cache
            />
            <Image
              src={`${BASE_URL}/images/menu-items/canstrawchocpist.png`}
              style={styles.canImage}
              cache
            />
          </View>
        </View>

        {/* Gold Divider */}
        <GoldDivider />

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Ticanmisu : à partir de</Text>
            <Text style={styles.priceValue}>50 Dh</Text>
          </View>
          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Can Dubai Chocolate :</Text>
            <Text style={styles.priceValue}>60 Dh</Text>
          </View>
          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Can Fraise Choco Pistache :</Text>
            <Text style={styles.priceValue}>65 Dh</Text>
          </View>
        </View>

        {/* Gold Divider */}
        <GoldDivider />

        {/* Darija Slogan */}
        <View style={styles.sloganContainer}>
          <SloganDarija text="ديسير فالكان، هاني وبنين!" />
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
