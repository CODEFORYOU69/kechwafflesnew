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
    marginBottom: 5,
  },
  subtitleAr: {
    fontFamily: "Cairo",
    fontSize: 36,
    color: colors.white,
    textAlign: "center",
    marginBottom: 25,
  },
  juicesRow: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
    marginBottom: 25,
    width: "100%",
  },
  juiceColumn: {
    flex: 1,
    alignItems: "center",
  },
  juiceImage: {
    width: 550,
    height: 550,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.gold,
    objectFit: "cover",
    marginBottom: 15,
  },
  juiceLabel: {
    fontFamily: "Montserrat",
    fontSize: 34,
    fontWeight: 700,
    color: colors.white,
    textAlign: "center",
    marginBottom: 4,
  },
  juiceLabelAr: {
    fontFamily: "Cairo",
    fontSize: 28,
    color: colors.gold,
    textAlign: "center",
    marginBottom: 15,
  },
  priceCard: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.gold,
    paddingVertical: 30,
    paddingHorizontal: 60,
    width: "85%",
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
    fontSize: 40,
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

export function PosterRamadanJuice() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={240} />
        </View>

        {/* Ramadan Badge */}
        <View style={styles.ramadanBadge}>
          <Text style={styles.ramadanBadgeText}>رمضان مبارك</Text>
        </View>

        {/* Title */}
        <Text style={styles.titleFr}>JUS FRAIS</Text>
        <Text style={styles.titleAr}>عصير فريش</Text>
        <Text style={styles.subtitleFr}>A EMPORTER</Text>
        <Text style={styles.subtitleAr}>للدار</Text>

        {/* Two juices side by side */}
        <View style={styles.juicesRow}>
          {/* Jus d'Orange */}
          <View style={styles.juiceColumn}>
            <Image
              src={`${BASE_URL}/images/menu-items/jusdorange.png`}
              style={styles.juiceImage}
              cache
            />
            <Text style={styles.juiceLabel}>Jus d&#x27;Orange</Text>
            <Text style={styles.juiceLabelAr}>عصير الليمون</Text>
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>25 cl</Text>
                <Text style={styles.priceValue}>10 Dh</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>50 cl</Text>
                <Text style={styles.priceValue}>18 Dh</Text>
              </View>
              <View style={styles.priceRowLast}>
                <Text style={styles.priceSize}>1 Litre</Text>
                <Text style={styles.priceValue}>32 Dh</Text>
              </View>
            </View>
          </View>

          {/* Jus Carotte Orange */}
          <View style={styles.juiceColumn}>
            <Image
              src={`${BASE_URL}/images/menu-items/jusdorange.png`}
              style={styles.juiceImage}
              cache
            />
            <Text style={styles.juiceLabel}>Jus Carotte Orange</Text>
            <Text style={styles.juiceLabelAr}>عصير خيزو و ليمون</Text>
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>25 cl</Text>
                <Text style={styles.priceValue}>15 Dh</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceSize}>50 cl</Text>
                <Text style={styles.priceValue}>25 Dh</Text>
              </View>
              <View style={styles.priceRowLast}>
                <Text style={styles.priceSize}>1 Litre</Text>
                <Text style={styles.priceValue}>40 Dh</Text>
              </View>
            </View>
          </View>
        </View>

        <GoldDivider />

        {/* Ramadan Moubarak */}
        <View style={styles.sloganContainer}>
          <Text style={styles.ramadanMoubarak}>Ramadan Moubarak</Text>
          <Text style={styles.sloganAr}>فطورك فريش معانا!</Text>
          <Text style={styles.sloganFr}>{"Votre ftour, frais avec nous !"}</Text>
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
