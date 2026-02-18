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
    backgroundColor: colors.coffeeBean,
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
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 25,
    justifyContent: "center",
    marginBottom: 10,
  },
  photoItem: {
    width: 350,
    height: 350,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  productList: {
    width: "100%",
    marginBottom: 10,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  productName: {
    fontFamily: "Montserrat",
    fontSize: 28,
    color: colors.white,
  },
  productPrice: {
    fontFamily: "Montserrat",
    fontSize: 28,
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

const coffeeImages = [
  ["espresso.png", "cappuccino.png", "DALGONA.png", "coldbrew.png"],
  ["cortado.png", "frappé.png", "icedlatté.png"],
];

export function PosterCoffee({ products }: { products: Product[] }) {
  const coffeeProducts = products.filter(
    (p) => p.category === "Boissons - Cafés"
  );

  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <PosterLogo color="white" size={220} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <BilingualText fr="NOS CAFÉS" ar="القهاوي ديالنا" />
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Photo Grid */}
        {coffeeImages.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.photoGrid}>
            {row.map((filename) => (
              <Image
                key={filename}
                src={`${BASE_URL}/images/menu-items/${filename}`}
                style={styles.photoItem}
                cache
              />
            ))}
          </View>
        ))}

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Product List */}
        <View style={styles.productList}>
          {coffeeProducts.map((product) => {
            const price =
              product.price ?? (product.variants.length > 0 ? product.variants[0].price : null);
            return (
              <View key={product.name} style={styles.productRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {price != null ? `${price} Dh` : ""}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Gold Divider */}
        <View style={styles.dividerContainer}>
          <GoldDivider />
        </View>

        {/* Slogan */}
        <View style={styles.sloganContainer}>
          <SloganDarija text="محضّرة بالحب" />
        </View>

        {/* Footer */}
        <PosterFooter />
      </Page>
    </Document>
  );
}
