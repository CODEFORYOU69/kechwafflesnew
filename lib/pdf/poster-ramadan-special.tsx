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
  PosterFooter,
  GoldDivider,
} from "@/lib/pdf/poster-shared";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#1B5E20",
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
  ramadanBadge: {
    backgroundColor: colors.gold,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginBottom: 25,
  },
  ramadanBadgeText: {
    fontFamily: "Cairo",
    fontSize: 38,
    fontWeight: 700,
    color: "#1B5E20",
    textAlign: "center",
  },
  titleFr: {
    fontFamily: "Montserrat",
    fontSize: 68,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 8,
  },
  titleAr: {
    fontFamily: "Cairo",
    fontSize: 50,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleFr: {
    fontFamily: "Montserrat",
    fontSize: 42,
    fontWeight: 700,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 25,
  },
  productsRow: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    marginBottom: 30,
    width: "100%",
  },
  productColumn: {
    flex: 1,
    alignItems: "center",
  },
  productImage: {
    width: 600,
    height: 600,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.gold,
    objectFit: "cover",
    marginBottom: 20,
  },
  productLabel: {
    fontFamily: "Montserrat",
    fontSize: 44,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    marginBottom: 6,
  },
  productLabelAr: {
    fontFamily: "Cairo",
    fontSize: 34,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 20,
  },
  priceCard: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.gold,
    paddingVertical: 25,
    paddingHorizontal: 35,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(212,175,55,0.3)",
  },
  priceRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  priceSize: {
    fontFamily: "Montserrat",
    fontSize: 38,
    fontWeight: 700,
    color: colors.white,
  },
  priceValue: {
    fontFamily: "Montserrat",
    fontSize: 44,
    fontWeight: 700,
    color: colors.gold,
  },
  sloganContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  ramadanMoubarak: {
    fontFamily: "Great Vibes",
    fontSize: 52,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 10,
  },
  sloganAr: {
    fontFamily: "Cairo",
    fontSize: 46,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 8,
  },
  sloganFr: {
    fontFamily: "Great Vibes",
    fontSize: 44,
    color: colors.white,
    textAlign: "center",
  },
});

export function PosterRamadanSpecial() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={200} />
        </View>

        {/* Ramadan Badge */}
        <View style={styles.ramadanBadge}>
          <Text style={styles.ramadanBadgeText}>رمضان مبارك</Text>
        </View>

        {/* Title */}
        <Text style={styles.titleFr}>SPÉCIAL RAMADAN</Text>
        <Text style={styles.titleAr}>سبيسيال رمضان</Text>
        <Text style={styles.subtitleFr}>KUNEFE & BOREK</Text>

        {/* Two products side by side */}
        <View style={styles.productsRow}>
          {/* Kunefe */}
          <View style={styles.productColumn}>
            <Image
              src={`${BASE_URL}/images/menu-items/kunefe-compressed.jpg`}
              style={styles.productImage}
              cache
            />
            <Text style={styles.productLabel}>Kunefe</Text>
            <Text style={styles.productLabelAr}>كنافة</Text>
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>Petit</Text>
                <Text style={styles.priceValue}>15 Dh</Text>
              </View>
              <View style={styles.priceRowLast}>
                <Text style={styles.priceSize}>Grand</Text>
                <Text style={styles.priceValue}>20 Dh</Text>
              </View>
            </View>
          </View>

          {/* Borek */}
          <View style={styles.productColumn}>
            <Image
              src={`${BASE_URL}/images/menu-items/borek2-compressed.jpg`}
              style={styles.productImage}
              cache
            />
            <Text style={styles.productLabel}>Borek</Text>
            <Text style={styles.productLabelAr}>بوريك</Text>
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>Petit</Text>
                <Text style={styles.priceValue}>20 Dh</Text>
              </View>
              <View style={styles.priceRowLast}>
                <Text style={styles.priceSize}>Grand</Text>
                <Text style={styles.priceValue}>30 Dh</Text>
              </View>
            </View>
          </View>
        </View>

        <GoldDivider />

        {/* Ramadan Moubarak */}
        <View style={styles.sloganContainer}>
          <Text style={styles.ramadanMoubarak}>Ramadan Moubarak</Text>
          <Text style={styles.sloganAr}>فطورك بنين معانا!</Text>
          <Text style={styles.sloganFr}>{"Votre ftour, délicieux avec nous !"}</Text>
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
