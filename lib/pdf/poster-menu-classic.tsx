import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  A1_SIZE,
  colors,
  PosterLogo,
  BilingualText,
  PosterFooter,
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
    paddingHorizontal: 45,
    paddingTop: 30,
    paddingBottom: 90,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 3,
  },
  twoColumns: {
    flexDirection: "row",
    gap: 25,
  },
  column: {
    flex: 1,
  },
  categoryBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    marginBottom: 4,
    marginTop: 7,
  },
  categoryText: {
    fontFamily: "Montserrat",
    fontSize: 18,
    fontWeight: 700,
    color: colors.white,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  productRowAlt: {
    backgroundColor: colors.lightGray,
  },
  productName: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 500,
    color: colors.black,
    flex: 1,
  },
  productPrice: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeight: 700,
    color: colors.red,
  },
});

const CATEGORIES_LEFT = [
  { category: "Bases Sucrées", banner: "BASES SUCRÉES" },
  { category: "Recettes Sucrées - Signatures", banner: "SIGNATURES SUCRÉES" },
  { category: "Desserts - Cans", banner: "DESSERTS CANS" },
  { category: "Boissons - Cafés", banner: "CAFÉS" },
  { category: "Boissons - Boissons Lactées", banner: "BOISSONS LACTÉES" },
  { category: "Boissons - Spécialisées", banner: "SPÉCIALISÉES" },
];

const CATEGORIES_RIGHT = [
  { category: "Bases Salées", banner: "BASES SALÉES" },
  { category: "Recettes Salées - Signatures", banner: "SIGNATURES SALÉES" },
  { category: "Recettes Salées - Classiques", banner: "CLASSIQUES SALÉES" },
  { category: "Boissons - Milkshakes", banner: "MILKSHAKES" },
  { category: "Boissons Ice Lactées", banner: "ICE LACTÉES" },
  { category: "Shots Vitaminés", banner: "SHOTS VITAMINÉS" },
  { category: "Jus Frais Pressés", banner: "JUS FRAIS" },
  { category: "Eaux & Soft Drinks", banner: "EAUX & SOFTS" },
];

// Produits à regrouper sur une seule ligne (nom partiel → label affiché)
const MERGE_KEYWORDS = ["oulmès fruitée", "oulmes fruitee", "oulmès bulles fruitées", "oulmes bulles fruitees"];

function getProductPrice(product: Product): string {
  if (product.variants && product.variants.length > 1) {
    const prices = product.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min} Dh`;
    return `${min}-${max} Dh`;
  }
  if (product.price != null) return `${product.price} Dh`;
  if (product.variants.length > 0) return `${product.variants[0].price} Dh`;
  return "";
}

function removeEmojis(text: string) {
  return text.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{200D}]|[\u{20E3}]|[\u{E0020}-\u{E007F}]/gu, "").trim();
}

function isMergeProduct(name: string): boolean {
  const lower = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return MERGE_KEYWORDS.some((kw) => lower.includes(kw));
}

function mergeProducts(items: Product[]): { name: string; price: string }[] {
  const merged: { name: string; price: string }[] = [];
  const mergeGroup: Product[] = [];

  for (const product of items) {
    if (isMergeProduct(product.name)) {
      mergeGroup.push(product);
    } else {
      merged.push({ name: removeEmojis(product.name), price: getProductPrice(product) });
    }
  }

  if (mergeGroup.length > 0) {
    const allPrices = mergeGroup.flatMap((p) =>
      p.variants.length > 0 ? p.variants.map((v) => v.price) : p.price != null ? [p.price] : []
    );
    const price = allPrices.length > 0 ? `${Math.min(...allPrices)} Dh` : "";
    merged.push({ name: "Oulmès Bulles Fruitées", price });
  }

  return merged;
}

function CategorySection({ category, banner, products }: { category: string; banner: string; products: Product[] }) {
  const items = products.filter((p) => p.category === category);
  if (items.length === 0) return null;

  const rows = mergeProducts(items);

  return (
    <View>
      <View style={styles.categoryBanner}>
        <Text style={styles.categoryText}>{banner}</Text>
      </View>
      {rows.map((row, idx) => (
        <View key={row.name} style={idx % 2 === 1 ? [styles.productRow, styles.productRowAlt] : [styles.productRow]}>
          <Text style={styles.productName}>{row.name}</Text>
          <Text style={styles.productPrice}>{row.price}</Text>
        </View>
      ))}
    </View>
  );
}

export function PosterMenuClassic({ products }: { products: Product[] }) {
  return (
    <Document>
      <Page size={A1_SIZE} style={styles.page}>
        <View style={styles.logoContainer}>
          <PosterLogo color="black" size={120} />
        </View>

        <View style={styles.titleContainer}>
          <BilingualText
            fr="NOTRE MENU"
            ar="الميني ديالنا"
            frStyle={{ color: colors.black, fontSize: 44 }}
            arStyle={{ color: colors.primary, fontSize: 30 }}
          />
        </View>

        <GoldDivider />

        <View style={styles.twoColumns}>
          <View style={styles.column}>
            {CATEGORIES_LEFT.map(({ category, banner }) => (
              <CategorySection key={category} category={category} banner={banner} products={products} />
            ))}
          </View>

          <View style={styles.column}>
            {CATEGORIES_RIGHT.map(({ category, banner }) => (
              <CategorySection key={category} category={category} banner={banner} products={products} />
            ))}
          </View>
        </View>

        <PosterFooter color={colors.darkGray} />
      </Page>
    </Document>
  );
}
