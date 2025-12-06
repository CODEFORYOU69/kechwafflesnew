/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Enregistrer les polices (variable font)
Font.register({
  family: "Montserrat",
  src: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/fonts/Montserrat-VariableFont_wght.ttf`,
});

Font.register({
  family: "Great Vibes",
  src: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/fonts/GreatVibes-Regular.ttf`,
});

// Types
type ProductVariant = {
  option1Name: string | null;
  option1Value: string | null;
  option2Name: string | null;
  option2Value: string | null;
  price: number;
};

type Product = {
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  image: string | null;
  variants: ProductVariant[];
};

type MenuPDFProps = {
  products: Product[];
  generatedAt: string;
};

// Couleurs Kech Waffles (Maroc)
const colors = {
  primary: "#1B5E20",
  gold: "#D4AF37",
  red: "#C62828",
  black: "#1a1a1a",
  white: "#FFFFFF",
  cream: "#FDF5E6",
  lightGray: "#F8F8F8",
  darkGray: "#333333",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com';

// Styles optimisés pour A4 pleine page
const styles = StyleSheet.create({
  // === PAGE ===
  page: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: colors.cream,
    fontFamily: "Montserrat",
  },

  // === COUVERTURE ===
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
  coverLogo: {
    width: 250,
    height: 250,
    marginBottom: 40,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 15,
  },
  coverSubtitle: {
    fontSize: 20,
    color: colors.gold,
    marginTop: 25,
  },

  // === EN-TÊTE ===
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: colors.gold,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "Great Vibes",
    color: colors.black,
    flex: 1,
  },

  // === BANDEAU D'IMAGES ===
  imageBanner: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 6,
    height: 70,
  },
  bannerImage: {
    flex: 1,
    height: 70,
    objectFit: "cover",
    borderRadius: 5,
  },

  // === TITRES DE SECTION ===
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    marginTop: 8,
    borderRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.primary,
    marginBottom: 6,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
    paddingBottom: 3,
  },

  // === GRILLE BASES (Pizza/Potato) ===
  basesRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  baseCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  baseImage: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginBottom: 6,
    objectFit: "cover",
  },
  baseName: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.black,
    textAlign: "center",
    marginBottom: 3,
  },
  basePrice: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.red,
  },
  // === BASES COMPACTES (image + texte en ligne) ===
  basesCompactRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  baseCompactItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  baseCompactImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.gold,
    objectFit: "cover",
  },
  baseCompactInfo: {
    flex: 1,
  },
  baseCompactName: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.black,
  },
  baseCompactPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.red,
  },

  // === PRODUIT SIGNATURE (avec image) ===
  signatureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  signatureCard: {
    width: "31%",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  signatureImage: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    marginBottom: 5,
    objectFit: "cover",
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.black,
    marginBottom: 2,
  },
  signatureDescription: {
    fontSize: 7,
    fontWeight: 400,
    color: colors.darkGray,
    marginBottom: 4,
    lineHeight: 1.2,
  },
  signaturePrice: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.red,
    textAlign: "right",
  },

  // === LISTE PRODUITS (texte) ===
  productList: {
    marginTop: 4,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  productRowAlt: {
    backgroundColor: colors.lightGray,
  },
  productName: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.black,
    flex: 1,
  },
  productDesc: {
    fontSize: 8,
    fontWeight: 400,
    color: colors.darkGray,
    flex: 2,
    marginHorizontal: 8,
  },
  productPrice: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.red,
    minWidth: 55,
    textAlign: "right",
  },

  // === GRILLE SUPPLÉMENTS ===
  supplementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  supplementItem: {
    width: "32%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: colors.white,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  supplementName: {
    fontSize: 9,
    fontWeight: 500,
    color: colors.black,
    flex: 1,
  },
  supplementPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.red,
  },

  // === TYPES GAUFRES ===
  waffleTypesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  waffleTypeCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gold,
  },
  waffleTypeName: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.black,
    textAlign: "center",
    marginBottom: 2,
  },
  waffleTypePrice: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.red,
  },

  // === BOISSONS (liste compacte) ===
  drinkSection: {
    marginBottom: 8,
  },
  drinkCategoryTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gold,
  },
  drinkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  drinkItem: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingRight: 10,
  },
  drinkName: {
    fontSize: 10,
    fontWeight: 500,
    color: colors.black,
  },
  drinkPrice: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.red,
  },

  // === COMPOSITION ===
  composeBox: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  composeTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 4,
    textAlign: "center",
  },
  composeText: {
    fontSize: 9,
    color: colors.darkGray,
    textAlign: "center",
  },

  // === FOOTER ===
  footer: {
    position: "absolute",
    bottom: 12,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.gold,
  },
  footerText: {
    fontSize: 7,
    color: colors.darkGray,
  },
  pageNumber: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.primary,
  },

  // === PAGE PRÉSENTATION ===
  presentationPage: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 35,
    paddingRight: 35,
    backgroundColor: colors.cream,
    fontFamily: "Montserrat",
  },
  presentationTitle: {
    fontSize: 28,
    fontFamily: "Great Vibes",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  presentationSubtitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.black,
    marginBottom: 8,
    marginTop: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
    paddingBottom: 4,
  },
  presentationText: {
    fontSize: 9,
    color: colors.darkGray,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  presentationBullet: {
    fontSize: 9,
    color: colors.darkGray,
    marginBottom: 3,
    marginLeft: 10,
    lineHeight: 1.3,
  },
  presentationHighlight: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.primary,
    marginBottom: 3,
    marginLeft: 10,
  },
  presentationIcon: {
    fontSize: 9,
    color: colors.gold,
    marginRight: 5,
  },
  engagementRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  engagementIcon: {
    fontSize: 10,
    color: colors.gold,
    marginRight: 6,
    width: 12,
  },
  engagementText: {
    fontSize: 9,
    color: colors.darkGray,
    flex: 1,
  },

  // === PAGE FIN ===
  endPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 40,
  },
  endLogo: {
    width: 180,
    height: 180,
    marginBottom: 35,
  },
  endTitle: {
    fontSize: 28,
    fontFamily: "Great Vibes",
    color: colors.gold,
    marginBottom: 30,
  },
  endInfo: {
    alignItems: "center",
  },
  endInfoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  endInfoLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.gold,
    width: 100,
  },
  endInfoText: {
    fontSize: 12,
    color: colors.white,
  },
});

// === COMPOSANTS ===

const CoverPage = () => (
  <Page size="A4" style={styles.coverPage}>
    <Image
      src={`${BASE_URL}/images/menu-items/TransparentWhite.png`}
      style={styles.coverLogo}
      cache
    />
    <Text style={styles.coverTitle}>Notre Menu</Text>
    <Text style={styles.coverSubtitle}>Marrakech • {new Date().getFullYear()}</Text>
  </Page>
);

const PageHeader = ({ title }: { title: string }) => (
  <View style={styles.pageHeader}>
    <Image
      src={`${BASE_URL}/images/menu-items/transparentlogo.jpg`}
      style={styles.headerLogo}
      cache
    />
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const PageFooter = ({ pageNum }: { pageNum: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>Kech Waffles • Marrakech • www.kechwaffles.com</Text>
    <Text style={styles.pageNumber}>{pageNum}</Text>
  </View>
);

const ImageBanner = ({ images }: { images: string[] }) => (
  <View style={styles.imageBanner}>
    {images.map((img, idx) => (
      <Image
        key={idx}
        src={`${BASE_URL}/images/menu-items/${img}`}
        style={styles.bannerImage}
        cache
      />
    ))}
  </View>
);

// Fonction pour supprimer les emojis
const removeEmojis = (text: string) => {
  return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]/gu, "").trim();
};

const ProductRow = ({ product, alt, cleanPrefix = false, wrap = true }: { product: Product; alt?: boolean; cleanPrefix?: boolean; wrap?: boolean }) => {
  const rowStyles = alt
    ? [styles.productRow, styles.productRowAlt]
    : [styles.productRow];

  // Nettoyer le nom (enlever emojis et préfixes si demandé)
  let displayName = removeEmojis(product.name);
  if (cleanPrefix) {
    displayName = displayName.replace(/^Pizza Waffle\s+/i, "").replace(/^Potato Waffle\s+/i, "");
  }

  // Si le produit a des variantes avec des tailles différentes, afficher le détail
  if (product.variants && product.variants.length > 1 && product.variants[0].option1Value) {
    const variantDetails = product.variants
      .map(v => `${v.option1Value}: ${v.price} Dh`)
      .join(" | ");

    return (
      <View style={rowStyles} wrap={wrap}>
        <Text style={styles.productName}>{displayName}</Text>
        {product.description && (
          <Text style={styles.productDesc}>{product.description}</Text>
        )}
        <Text style={[styles.productPrice, { fontSize: 9 }]}>{variantDetails}</Text>
      </View>
    );
  }

  // Prix simple
  const price = product.price
    ? `${product.price} Dh`
    : product.variants.length > 0
      ? `${product.variants[0].price} Dh`
      : "";

  return (
    <View style={rowStyles} wrap={wrap}>
      <Text style={styles.productName}>{displayName}</Text>
      {product.description && (
        <Text style={styles.productDesc}>{product.description}</Text>
      )}
      <Text style={styles.productPrice}>{price}</Text>
    </View>
  );
};

// Ligne boisson simple (sans image)
const DrinkItem = ({ product }: { product: Product }) => {
  // Si le produit a des variantes avec des tailles différentes, afficher le détail
  if (product.variants && product.variants.length > 1 && product.variants[0].option1Value) {
    const variantDetails = product.variants
      .map(v => `${v.option1Value}: ${v.price}`)
      .join(" | ");

    return (
      <View style={styles.drinkItem}>
        <Text style={styles.drinkName}>{product.name}</Text>
        <Text style={[styles.drinkPrice, { fontSize: 8 }]}>{variantDetails} Dh</Text>
      </View>
    );
  }

  let priceDisplay = "";
  if (product.price) {
    priceDisplay = `${product.price} Dh`;
  } else if (product.variants.length > 0) {
    priceDisplay = `${product.variants[0].price} Dh`;
  }

  return (
    <View style={styles.drinkItem}>
      <Text style={styles.drinkName}>{product.name}</Text>
      <Text style={styles.drinkPrice}>{priceDisplay}</Text>
    </View>
  );
};

const PresentationPage = ({ pageNum }: { pageNum: number }) => (
  <Page size="A4" style={styles.presentationPage}>
    <Text style={styles.presentationTitle}>Kech Waffles - L&apos;art de la gaufre à Marrakech</Text>

    <Text style={styles.presentationSubtitle}>Notre Philosophie : Le Fait Maison Avant Tout</Text>
    <Text style={styles.presentationText}>
      Chez Kech Waffles, chaque gaufre est une création unique, préparée avec amour et patience.
      Nous croyons en la valeur du fait maison et refusons tout compromis sur la qualité.
    </Text>
    <Text style={styles.presentationBullet}>• Pâtes préparées quotidiennement dans notre laboratoire</Text>
    <Text style={styles.presentationBullet}>• Sauces chocolat & pistache créées maison avec recettes exclusives</Text>
    <Text style={styles.presentationBullet}>• Garnitures fraîches sélectionnées chaque matin</Text>
    <Text style={styles.presentationBullet}>• Cuisson minute pour une fraîcheur incomparable</Text>
    <Text style={styles.presentationBullet}>• Glaces artisanales préparées avec soin</Text>

    <Text style={styles.presentationSubtitle}>Des Ingrédients d&apos;Exception</Text>
    <Text style={styles.presentationText}>
      Notre engagement : n&apos;utiliser que les meilleurs produits pour vous offrir une expérience gustative inoubliable.
    </Text>
    <Text style={styles.presentationHighlight}>• CHOCOLAT CALLEBAUT (Belgique) - Le chocolat des plus grands chocolatiers du monde</Text>
    <Text style={styles.presentationHighlight}>• CRÈME PISTACHE DE QUALITÉ - Une crème pistache authentique au goût intense</Text>
    <Text style={styles.presentationHighlight}>• MASCARPONE DE QUALITÉ - Pour notre crème tiramisu maison</Text>
    <Text style={styles.presentationHighlight}>• PERLES DE SUCRE - Pour nos gaufres liégeoises authentiques</Text>

    <Text style={styles.presentationSubtitle}>Nos Créations Signature</Text>
    <Text style={styles.presentationBullet}>• PIZZA WAFFLES - Notre concept innovant qui fusionne l&apos;Italie et la Belgique</Text>
    <Text style={styles.presentationBullet}>• POTATO WAFFLES - Notre création originale avec pommes de terre</Text>
    <Text style={styles.presentationBullet}>• BUBBLE WAFFLES - Le dessert tendance de Hong Kong revisité</Text>
    <Text style={styles.presentationBullet}>• TIRAMISU WAFFLE - Notre création exclusive avec crème tiramisu maison</Text>

    <Text style={styles.presentationSubtitle}>Notre Engagement Qualité</Text>
    <View style={styles.engagementRow}>
      <Text style={styles.engagementIcon}>✓</Text>
      <Text style={styles.engagementText}>FRAÎCHEUR GARANTIE - Pâtes préparées le jour même, cuisson minute</Text>
    </View>
    <View style={styles.engagementRow}>
      <Text style={styles.engagementIcon}>✓</Text>
      <Text style={styles.engagementText}>INGRÉDIENTS NOBLES - Les meilleurs produits du Maroc et d&apos;ailleurs</Text>
    </View>
    <View style={styles.engagementRow}>
      <Text style={styles.engagementIcon}>✓</Text>
      <Text style={styles.engagementText}>TRANSPARENCE TOTALE - Nous sommes fiers de nos recettes</Text>
    </View>
    <View style={styles.engagementRow}>
      <Text style={styles.engagementIcon}>✓</Text>
      <Text style={styles.engagementText}>FAIT MAISON VÉRITABLE - Pas de poudres industrielles</Text>
    </View>
    <View style={styles.engagementRow}>
      <Text style={styles.engagementIcon}>✓</Text>
      <Text style={styles.engagementText}>HYGIÈNE IRRÉPROCHABLE - Laboratoire aux normes</Text>
    </View>

    <PageFooter pageNum={pageNum} />
  </Page>
);

const EndPage = () => (
  <Page size="A4" style={styles.endPage}>
    <Image
      src={`${BASE_URL}/images/menu-items/TransparentWhite.png`}
      style={styles.endLogo}
      cache
    />
    <Text style={styles.endTitle}>Merci de votre visite !</Text>
    <View style={styles.endInfo}>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Adresse</Text>
        <Text style={styles.endInfoText}>MAG 33 AL BADII, Marrakech</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Instagram</Text>
        <Text style={styles.endInfoText}>@kech_waffles</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Facebook</Text>
        <Text style={styles.endInfoText}>kechwaffles</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>TikTok</Text>
        <Text style={styles.endInfoText}>@kechwaffles</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Snapchat</Text>
        <Text style={styles.endInfoText}>kechwaffles</Text>
      </View>
    </View>
  </Page>
);

// === DOCUMENT PRINCIPAL ===
export const MenuPDF = ({ products }: MenuPDFProps) => {
  // Classification des suppléments salés
  const saltyKeywords = [
    "jambon", "mozzarella", "olives", "pepperoni", "poulet", "thon",
    "viande hachée", "viande hachee", "cheddar", "oignons", "gruyère",
    "gruyere", "harissa", "mayo", "pesto", "saucisse", "fromage"
  ];

  // ===== SALÉES =====
  const basesSalees = products.filter(p => p.category === "Bases Salées");
  const saucesSalees = products.filter(p => p.category === "Sauces Salées");
  const recettesSignaturesSalees = products.filter(p => p.category === "Recettes Salées - Signatures");
  const recettesClassiquesSalees = products.filter(p => p.category === "Recettes Salées - Classiques");

  // ===== SUCRÉES =====
  const basesSucrees = products.filter(p => p.category === "Bases Sucrées");
  const recettesSignaturesSucrees = products.filter(p => p.category === "Recettes Sucrées - Signatures");
  const dessertsCans = products.filter(p => p.category === "Desserts - Cans");

  // ===== BOISSONS =====
  const cafes = products.filter(p => p.category === "Boissons - Cafés");
  const boissonsLactees = products.filter(p => p.category === "Boissons - Boissons Lactées");
  const boissonsSpecialisees = products.filter(p => p.category === "Boissons - Spécialisées");
  const milkshakes = products.filter(p => p.category === "Boissons - Milkshakes");
  const boissonsIce = products.filter(p => p.category === "Boissons Ice Lactées");
  const eauxSoftDrinks = products.filter(p => p.category === "Eaux & Soft Drinks");
  const jusFrais = products.filter(p => p.category === "Jus Frais Pressés");
  const shots = products.filter(p => p.category === "Shots Vitaminés");

  // ===== SUPPLÉMENTS =====
  const allModifiers = products.filter(p => p.category === "Modificateurs");

  const supplementsSales = allModifiers.filter(p => {
    const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return saltyKeywords.some(kw => nameLower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  });

  const supplementsSucres = allModifiers.filter(p => {
    const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Exclure lait végétal des suppléments sucrés (il va dans les boissons)
    if (nameLower.includes("lait vegetal") || nameLower.includes("lait végétal")) return false;
    return !saltyKeywords.some(kw => nameLower.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
  });

  // Supplément lait végétal pour les boissons
  const laitVegetal = allModifiers.find(p => {
    const nameLower = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return nameLower.includes("lait vegetal") || nameLower.includes("lait végétal");
  });

  const thes = boissonsSpecialisees.filter(p =>
    p.name.toLowerCase().includes("thé") || p.name.toLowerCase().includes("menthe")
  );
  const chocolats = boissonsSpecialisees.filter(p =>
    !p.name.toLowerCase().includes("thé") && !p.name.toLowerCase().includes("menthe")
  );

  let pageNum = 1;

  return (
    <Document title="Menu Kech Waffles" author="Kech Waffles">
      {/* PAGE 1: COUVERTURE */}
      <CoverPage />

      {/* PAGE 2: PRÉSENTATION */}
      <PresentationPage pageNum={++pageNum} />

      {/* PAGE 3: VIDE */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1 }} />
        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 4: WAFFLES SALÉES === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Nos Waffles Salées" />
        <ImageBanner images={["image00016-small.jpg", "image00017-small.jpg", "image00001-small.jpg"]} />

        {/* Choix de la base et sauce côte à côte */}
        <View style={{ flexDirection: "row", gap: 20, marginBottom: 6 }}>
          {/* Bases */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 6, fontSize: 12, paddingVertical: 4 }]}>1. Choisissez votre base</Text>
            <View style={styles.basesCompactRow}>
              {basesSalees.map((base, idx) => (
                <View key={idx} style={styles.baseCompactItem}>
                  {base.image && (
                    <Image
                      src={`${BASE_URL}/images/menu-items/${base.image}`}
                      style={styles.baseCompactImage}
                      cache
                    />
                  )}
                  <View style={styles.baseCompactInfo}>
                    <Text style={styles.baseCompactName}>{base.name}</Text>
                    <Text style={styles.baseCompactPrice}>{base.price} Dh</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Sauces */}
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 6, fontSize: 12, paddingVertical: 4 }]}>2. Choisissez votre sauce</Text>
            <View style={styles.basesCompactRow}>
              {saucesSalees.map((sauce, idx) => (
                <View key={idx} style={styles.baseCompactItem}>
                  {sauce.image && (
                    <Image
                      src={`${BASE_URL}/images/menu-items/${sauce.image}`}
                      style={styles.baseCompactImage}
                      cache
                    />
                  )}
                  <View style={styles.baseCompactInfo}>
                    <Text style={styles.baseCompactName}>{sauce.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recettes signatures - liste simple */}
        <Text style={[styles.sectionTitle, { marginTop: 4, fontSize: 12, paddingVertical: 4 }]}>3. Nos Recettes Signatures</Text>
        <View style={styles.productList}>
          {recettesSignaturesSalees.map((product, idx) => (
            <ProductRow key={idx} product={product} alt={idx % 2 === 1} />
          ))}
        </View>

        {/* Recettes classiques - liste simple */}
        <Text style={[styles.sectionTitle, { marginTop: 4, fontSize: 12, paddingVertical: 4 }]}>4. Nos Recettes Classiques</Text>
        <View style={styles.productList}>
          {recettesClassiquesSalees.map((product, idx) => (
            <ProductRow key={idx} product={product} alt={idx % 2 === 1} />
          ))}
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 5: SUPPLÉMENTS SALÉS === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Suppléments Salés" />

        <Text style={styles.sectionTitle}>Personnalisez votre waffle salée</Text>
        <View style={styles.productList}>
          {[...supplementsSales]
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .map((product, idx) => (
              <ProductRow key={idx} product={product} alt={idx % 2 === 1} />
            ))}
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 6: WAFFLES SUCRÉES === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Nos Waffles Sucrées" />
        <ImageBanner images={["IMG_1919-small.jpg", "IMG_1674-small.jpg", "image00020-small.jpg"]} />

        {/* Choix de la base */}
        <Text style={styles.sectionTitle}>1. Choisissez votre base</Text>
        <View style={styles.waffleTypesRow}>
          {basesSucrees.map((base, idx) => (
            <View key={idx} style={styles.waffleTypeCard}>
              {base.image && (
                <Image
                  src={`${BASE_URL}/images/menu-items/${base.image}`}
                  style={{ width: 50, height: 50, borderRadius: 4, marginBottom: 4, objectFit: "cover" }}
                  cache
                />
              )}
              <Text style={styles.waffleTypeName}>{base.name}</Text>
              <Text style={styles.waffleTypePrice}>{base.price} Dh</Text>
            </View>
          ))}
        </View>

        {/* Suppléments sucrés */}
        <Text style={styles.sectionTitle}>2. Toppings & Sauces</Text>
        <View style={styles.productList}>
          {[...supplementsSucres]
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .map((product, idx) => (
              <ProductRow key={idx} product={product} alt={idx % 2 === 1} wrap={false} />
            ))}
        </View>

        {/* Recettes signatures sucrées */}
        <Text style={styles.sectionTitle}>3. Nos Créations Signatures</Text>
        <View style={styles.productList}>
          {recettesSignaturesSucrees.map((product, idx) => (
            <ProductRow key={idx} product={product} alt={idx % 2 === 1} />
          ))}
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 7: CANS === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Nos Cans" />
        <ImageBanner images={["IMG_1778-small.jpg", "IMG_1779-small.jpg", "IMG_1780-small.jpg"]} />

        <Text style={styles.sectionTitle}>Desserts en pot à emporter</Text>
        <View style={styles.productList}>
          {dessertsCans.map((product, idx) => {
            // Si le produit a des variantes, les afficher
            if (product.variants && product.variants.length > 0) {
              return product.variants.map((variant, vIdx) => {
                const variantName = variant.option1Value
                  ? `${removeEmojis(product.name)} - ${variant.option1Value}`
                  : removeEmojis(product.name);
                return (
                  <View key={`${idx}-${vIdx}`} style={(idx + vIdx) % 2 === 1 ? [styles.productRow, styles.productRowAlt] : [styles.productRow]}>
                    <Text style={styles.productName}>{variantName}</Text>
                    <Text style={styles.productPrice}>{variant.price} Dh</Text>
                  </View>
                );
              });
            }
            return <ProductRow key={idx} product={product} alt={idx % 2 === 1} />;
          })}
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 8: BOISSONS CHAUDES === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Nos Boissons Chaudes" />
        <ImageBanner images={["espresso.png", "cappuccino.png", "chocolatchaud.png"]} />

        {/* Cafés */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkCategoryTitle}>Cafés</Text>
          <View style={styles.drinkGrid}>
            {cafes.map((product, idx) => (
              <DrinkItem key={idx} product={product} />
            ))}
          </View>
        </View>

        {/* Boissons Lactées */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkCategoryTitle}>Boissons Lactées</Text>
          <View style={styles.drinkGrid}>
            {boissonsLactees.map((product, idx) => (
              <DrinkItem key={idx} product={product} />
            ))}
          </View>
          {laitVegetal && (
            <Text style={{ fontSize: 8, color: colors.darkGray, marginTop: 4, fontStyle: "italic" }}>
              Supplément {removeEmojis(laitVegetal.name)}: +{laitVegetal.price} Dh
            </Text>
          )}
        </View>

        {/* Thés */}
        {thes.length > 0 && (
          <View style={styles.drinkSection}>
            <Text style={styles.drinkCategoryTitle}>Thés</Text>
            <View style={styles.drinkGrid}>
              {thes.map((product, idx) => (
                <DrinkItem key={idx} product={product} />
              ))}
            </View>
          </View>
        )}

        {/* Chocolats */}
        {chocolats.length > 0 && (
          <View style={styles.drinkSection}>
            <Text style={styles.drinkCategoryTitle}>Chocolats</Text>
            <View style={styles.drinkGrid}>
              {chocolats.map((product, idx) => (
                <DrinkItem key={idx} product={product} />
              ))}
            </View>
          </View>
        )}

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 7: BOISSONS GLACÉES === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Boissons Glacées & Milkshakes" />
        <ImageBanner images={["DALGONA.png", "frappé.png", "chailattéfroid.png"]} />

        {/* Ice Lactées */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkCategoryTitle}>Ice Lactées</Text>
          <View style={styles.drinkGrid}>
            {boissonsIce.map((product, idx) => (
              <DrinkItem key={idx} product={product} />
            ))}
          </View>
          {laitVegetal && (
            <Text style={{ fontSize: 8, color: colors.darkGray, marginTop: 4, fontStyle: "italic" }}>
              Supplément {removeEmojis(laitVegetal.name)}: +{laitVegetal.price} Dh
            </Text>
          )}
        </View>

        {/* Milkshakes */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkCategoryTitle}>Milkshakes</Text>
          <View style={styles.drinkGrid}>
            {milkshakes.map((product, idx) => (
              <DrinkItem key={idx} product={product} />
            ))}
          </View>
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 8: SHOTS VITAMINÉS === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Shots Vitaminés" />
        <ImageBanner images={["shotlaidor.png", "shotvertdetox.png", "shotbetterave.png"]} />

        <Text style={styles.sectionTitle}>Nos Shots Santé</Text>
        <View style={styles.productList}>
          {shots.map((product, idx) => (
            <ProductRow key={idx} product={product} alt={idx % 2 === 1} />
          ))}
        </View>

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* === PAGE 9: SOFT DRINKS & EAUX === */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Soft Drinks & Eaux" />

        {/* Eaux & Soft Drinks */}
        <View style={styles.drinkSection}>
          <Text style={styles.drinkCategoryTitle}>Eaux & Soft Drinks</Text>
          <View style={styles.drinkGrid}>
            {eauxSoftDrinks.map((product, idx) => (
              <DrinkItem key={idx} product={product} />
            ))}
          </View>
        </View>

        {/* Jus Frais */}
        {jusFrais.length > 0 && (
          <View style={styles.drinkSection}>
            <Text style={styles.drinkCategoryTitle}>Jus Frais Pressés</Text>
            <View style={styles.drinkGrid}>
              {jusFrais.map((product, idx) => (
                <DrinkItem key={idx} product={product} />
              ))}
            </View>
          </View>
        )}

        <PageFooter pageNum={++pageNum} />
      </Page>

      {/* PAGE DE FIN */}
      <EndPage />
    </Document>
  );
};
