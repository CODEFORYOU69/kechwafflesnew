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

type Product = {
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  image: string | null;
  variants: {
    option1Name: string | null;
    option1Value: string | null;
    option2Name: string | null;
    option2Value: string | null;
    price: number;
  }[];
};

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
    width: "90%",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,175,55,0.3)",
  },
  priceName: {
    fontFamily: "Montserrat",
    fontSize: 30,
    color: colors.white,
    flex: 1,
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
});

export function PosterCans({ products }: { products: Product[] }) {
  const cansProducts = products.filter((p) => p.category === "Desserts - Cans");

  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={220} />
        </View>

        <View style={styles.titleContainer}>
          <BilingualText fr="NOS CANS" ar="الكان ديالنا" />
        </View>

        <GoldDivider />

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          <View style={styles.photoRow}>
            <Image src={`${BASE_URL}/images/menu-items/ticanoreo.png`} style={styles.canImage} cache />
            <Image src={`${BASE_URL}/images/menu-items/ticanfraise.png`} style={styles.canImage} cache />
            <Image src={`${BASE_URL}/images/menu-items/ticancaramel.png`} style={styles.canImage} cache />
          </View>
          <View style={styles.photoRow}>
            <Image src={`${BASE_URL}/images/menu-items/ticanbueno.png`} style={styles.canImage} cache />
            <Image src={`${BASE_URL}/images/menu-items/dubaichocolatecan.png`} style={styles.canImage} cache />
            <Image src={`${BASE_URL}/images/menu-items/canstrawchocpist.png`} style={styles.canImage} cache />
          </View>
        </View>

        <GoldDivider />

        {/* Prix depuis la DB */}
        <View style={styles.priceSection}>
          {cansProducts.map((product) => {
            if (product.variants && product.variants.length > 1) {
              const prices = product.variants.map((v) => v.price);
              const min = Math.min(...prices);
              const max = Math.max(...prices);
              const priceText = min === max ? `${min} Dh` : `${min} - ${max} Dh`;
              return (
                <View key={product.name} style={styles.priceRow}>
                  <Text style={styles.priceName}>{product.name}</Text>
                  <Text style={styles.priceValue}>{priceText}</Text>
                </View>
              );
            }
            const price = product.price ?? (product.variants.length > 0 ? product.variants[0].price : null);
            return (
              <View key={product.name} style={styles.priceRow}>
                <Text style={styles.priceName}>{product.name}</Text>
                <Text style={styles.priceValue}>{price != null ? `${price} Dh` : ""}</Text>
              </View>
            );
          })}
        </View>

        <GoldDivider />

        <View style={styles.sloganContainer}>
          <SloganDarija text="ديسير فالكان، هاني وبنين!" />
        </View>

        <PosterFooter />
      </Page>
    </Document>
  );
}
