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
    paddingTop: 40,
    paddingBottom: 100,
    paddingHorizontal: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Montserrat",
    fontSize: 36,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginBottom: 15,
  },
  shotImage: {
    width: 330,
    height: 330,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  juiceSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
    marginBottom: 15,
  },
  juiceImage: {
    width: 350,
    height: 350,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  priceLine: {
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "center",
  },
  priceLabel: {
    fontFamily: "Montserrat",
    fontSize: 28,
    color: colors.white,
  },
  priceValue: {
    fontFamily: "Montserrat",
    fontSize: 28,
    fontWeight: 700,
    color: colors.gold,
  },
  sloganContainer: {
    marginBottom: 15,
  },
  dividerContainer: {
    width: "100%",
  },
});

export function PosterShotsJuice() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={180} />
        </View>

        <View style={styles.titleContainer}>
          <BilingualText
            fr="SHOTS & JUS FRAIS"
            ar="شوطات و عصير فريش"
            frStyle={{ fontSize: 60 }}
            arStyle={{ fontSize: 42 }}
          />
        </View>

        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Shots Section */}
        <Text style={styles.sectionTitle}>SHOTS VITAMINES</Text>

        <View style={styles.imageRow}>
          <Image src={`${BASE_URL}/images/menu-items/shotbetterave.png`} style={styles.shotImage} cache />
          <Image src={`${BASE_URL}/images/menu-items/shotlaidor.png`} style={styles.shotImage} cache />
          <Image src={`${BASE_URL}/images/menu-items/shotvertdetox.png`} style={styles.shotImage} cache />
        </View>
        <View style={styles.imageRow}>
          <Image src={`${BASE_URL}/images/menu-items/shotcurcumamangue.png`} style={styles.shotImage} cache />
          <Image src={`${BASE_URL}/images/menu-items/shotananascoco.png`} style={styles.shotImage} cache />
          <Image src={`${BASE_URL}/images/menu-items/SHOTWHEATGRASS.png`} style={styles.shotImage} cache />
        </View>

        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Jus d'Orange - image + prix cote a cote */}
        <Text style={styles.sectionTitle}>JUS D&#x27;ORANGE FRAIS</Text>

        <View style={styles.juiceSection}>
          <Image src={`${BASE_URL}/images/menu-items/jusdorange.png`} style={styles.juiceImage} cache />
          <View>
            <View style={styles.priceLine}>
              <Text style={styles.priceLabel}>Shots : </Text>
              <Text style={styles.priceValue}>24 - 35 Dh</Text>
            </View>
            <View style={styles.priceLine}>
              <Text style={styles.priceLabel}>Jus d&#x27;Orange : </Text>
              <Text style={styles.priceValue}>25 - 45 Dh</Text>
            </View>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        <View style={styles.sloganContainer}>
          <SloganDarija text="صحتك فكاس!" />
        </View>

        <PosterFooter />
      </Page>
    </Document>
  );
}
