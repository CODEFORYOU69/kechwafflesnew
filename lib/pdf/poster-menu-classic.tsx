import React from "react";
import { Document, Page, View, StyleSheet } from "@react-pdf/renderer";
import {
  A1_SIZE,
  colors,
  PosterLogo,
  BilingualText,
  PosterFooter,
  CategoryBanner,
  ProductPriceRow,
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
    backgroundColor: colors.cream,
    fontFamily: "Montserrat",
    paddingHorizontal: 60,
    paddingTop: 40,
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
});

const CATEGORIES = [
  { category: "Bases Sucrées", banner: "BASES SUCRÉES" },
  { category: "Bases Salées", banner: "BASES SALÉES" },
  { category: "Recettes Sucrées - Signatures", banner: "SIGNATURES SUCRÉES" },
  { category: "Boissons - Cafés", banner: "CAFÉS" },
];

function getProductPrice(product: Product): string {
  if (product.price != null) {
    return `${product.price} Dh`;
  }
  if (product.variants.length > 0) {
    return `${product.variants[0].price} Dh`;
  }
  return "";
}

export function PosterMenuClassic({ products }: { products: Product[] }) {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        <View style={styles.logoContainer}>
          <PosterLogo color="black" size={200} />
        </View>

        <View style={styles.titleContainer}>
          <BilingualText
            fr="NOTRE MENU"
            ar="الميني ديالنا"
            frStyle={{ color: colors.black }}
            arStyle={{ color: colors.primary }}
          />
        </View>

        <GoldDivider />

        {CATEGORIES.map(({ category, banner }) => {
          const categoryProducts = products.filter(
            (p) => p.category === category
          );
          if (categoryProducts.length === 0) return null;
          return (
            <View key={category} style={styles.section}>
              <CategoryBanner text={banner} />
              {categoryProducts.map((product) => (
                <ProductPriceRow
                  key={product.name}
                  name={product.name}
                  price={getProductPrice(product)}
                />
              ))}
            </View>
          );
        })}

        <PosterFooter color={colors.darkGray} />
      </Page>
    </Document>
  );
}
