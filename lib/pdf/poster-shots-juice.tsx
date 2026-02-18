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
    backgroundColor: colors.shotGreen,
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontSize: 40,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    marginBottom: 25,
  },
  imageRow: {
    flexDirection: "row",
    gap: 25,
    justifyContent: "center",
    marginBottom: 25,
  },
  shotImage: {
    width: 400,
    height: 400,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  juiceImage: {
    width: 500,
    height: 500,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  juiceImageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  priceLine: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
  },
  priceLabel: {
    fontFamily: "Montserrat",
    fontSize: 30,
    color: colors.white,
  },
  priceValue: {
    fontFamily: "Montserrat",
    fontSize: 30,
    fontWeight: 700,
    color: colors.gold,
  },
  sloganContainer: {
    marginBottom: 30,
  },
  dividerContainer: {
    width: "100%",
  },
});

export function PosterShotsJuice() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={220} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <BilingualText fr="SHOTS & JUS FRAIS" ar="شوطات و عصير فريش" />
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Shots Section */}
        <Text style={styles.sectionTitle}>SHOTS VITAMIN&#xC9;S</Text>

        {/* Row 1 */}
        <View style={styles.imageRow}>
          <Image
            src={`${BASE_URL}/images/menu-items/shotbetterave.png`}
            style={styles.shotImage}
            cache
          />
          <Image
            src={`${BASE_URL}/images/menu-items/shotlaidor.png`}
            style={styles.shotImage}
            cache
          />
          <Image
            src={`${BASE_URL}/images/menu-items/shotvertdetox.png`}
            style={styles.shotImage}
            cache
          />
        </View>

        {/* Row 2 */}
        <View style={styles.imageRow}>
          <Image
            src={`${BASE_URL}/images/menu-items/shotcurcumamangue.png`}
            style={styles.shotImage}
            cache
          />
          <Image
            src={`${BASE_URL}/images/menu-items/shotananascoco.png`}
            style={styles.shotImage}
            cache
          />
          <Image
            src={`${BASE_URL}/images/menu-items/SHOTWHEATGRASS.png`}
            style={styles.shotImage}
            cache
          />
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Jus d'Orange Section */}
        <Text style={styles.sectionTitle}>JUS D&#x27;ORANGE FRAIS</Text>

        <View style={styles.juiceImageContainer}>
          <Image
            src={`${BASE_URL}/images/menu-items/jusdorange.png`}
            style={styles.juiceImage}
            cache
          />
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Shots : </Text>
            <Text style={styles.priceValue}>24 - 35 Dh</Text>
          </View>
          <View style={styles.priceLine}>
            <Text style={styles.priceLabel}>Jus d&#x27;Orange : </Text>
            <Text style={styles.priceValue}>25 - 45 Dh</Text>
          </View>
        </View>

        {/* Slogan */}
        <View style={styles.sloganContainer}>
          <SloganDarija text="صحتك فكاس!" />
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
