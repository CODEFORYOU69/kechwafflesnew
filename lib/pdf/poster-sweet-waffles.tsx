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
  CategoryBanner,
} from "@/lib/pdf/poster-shared";

const bases = [
  { name: "Bruxelles", price: "25 Dh" },
  { name: "Liégeoise", price: "30 Dh" },
  { name: "Craffle", price: "35 Dh" },
  { name: "Pancakes", price: "35 Dh" },
  { name: "Bubble", price: "40 Dh" },
];

const signatures = [
  { name: "La Dubai", price: "55 Dh" },
  { name: "La Tiramisu", price: "45 Dh" },
  { name: "La Lotus", price: "45 Dh" },
  { name: "La Pistache", price: "45 Dh" },
  { name: "La Kinder", price: "45 Dh" },
  { name: "L'Oréo", price: "45 Dh" },
];

const photoBannerImages = [
  "wafflestiramisu.png",
  "BUBBLETIRA.png",
  "pancakestiramisu.png",
  "crauffles.jpg",
];

const iceCreamImages = [
  "glacepistache.png",
  "glacechocolatnoir.png",
  "glacefraise.png",
  "glacevanille.png",
];

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.warmPink,
    padding: 50,
  },
  logoContainer: {
    alignItems: "center",
  },
  photoBannerRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginVertical: 20,
  },
  photoBannerImage: {
    width: 370,
    height: 350,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  basesRow: {
    flexDirection: "row",
    gap: 15,
  },
  baseItem: {
    alignItems: "center",
    flex: 1,
  },
  baseName: {
    fontFamily: "Montserrat",
    fontSize: 24,
    fontWeight: 700,
    color: colors.black,
  },
  basePrice: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: 700,
    color: colors.red,
  },
  signaturesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  signatureItem: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 6,
  },
  signatureName: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: 500,
    color: colors.black,
  },
  signaturePrice: {
    fontFamily: "Montserrat",
    fontSize: 26,
    fontWeight: 700,
    color: colors.red,
  },
  iceCreamRow: {
    flexDirection: "row",
    gap: 25,
    justifyContent: "center",
  },
  iceCreamImage: {
    width: 350,
    height: 350,
    borderRadius: 175,
    borderWidth: 3,
    borderColor: colors.gold,
    objectFit: "cover",
  },
});

export function PosterSweetWaffles() {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="black" size={200} />
        </View>

        {/* Title */}
        <BilingualText
          fr="GAUFRES SUCRÉES & GLACES"
          ar="وافل حلو و گلاص"
          frStyle={{ color: colors.black, fontSize: 60 }}
          arStyle={{ color: colors.primary }}
        />

        {/* Photo Banner */}
        <View style={styles.photoBannerRow}>
          {photoBannerImages.map((filename) => (
            <Image
              key={filename}
              src={`${BASE_URL}/images/menu-items/${filename}`}
              style={styles.photoBannerImage}
              cache
            />
          ))}
        </View>

        {/* Bases Section */}
        <CategoryBanner text="NOS BASES" />
        <View style={styles.basesRow}>
          {bases.map((item) => (
            <View key={item.name} style={styles.baseItem}>
              <Text style={styles.baseName}>{item.name}</Text>
              <Text style={styles.basePrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Signatures Section */}
        <CategoryBanner text="SIGNATURES" />
        <View style={styles.signaturesContainer}>
          {signatures.map((item) => (
            <View key={item.name} style={styles.signatureItem}>
              <Text style={styles.signatureName}>{item.name}</Text>
              <Text style={styles.signaturePrice}>{item.price}</Text>
            </View>
          ))}
        </View>

        {/* Ice Cream Section */}
        <CategoryBanner text="NOS GLACES" />
        <View style={styles.iceCreamRow}>
          {iceCreamImages.map((filename) => (
            <Image
              key={filename}
              src={`${BASE_URL}/images/menu-items/${filename}`}
              style={styles.iceCreamImage}
              cache
            />
          ))}
        </View>

        {/* Gold Divider */}
        <GoldDivider />

        {/* Slogan */}
        <SloganDarija text="حلاوة لي كتذوّب!" color={colors.primary} />

        {/* Footer */}
        <PosterFooter color={colors.darkGray} />
      </Page>
    </Document>
  );
}
