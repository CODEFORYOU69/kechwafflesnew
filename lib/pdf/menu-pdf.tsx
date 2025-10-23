import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Enregistrer les polices (optionnel, utilise Helvetica par défaut)
// import { Font } from "@react-pdf/renderer";
// Font.register({
//   family: "Poppins",
//   src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf",
// });

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

// Styles élégants et sobres
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },

  // Page de couverture
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  coverLogo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  coverSubtitle: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 10,
    fontWeight: "bold",
  },
  coverCity: {
    fontSize: 16,
    color: "#D4AF37",
    marginTop: 40,
  },
  coverYear: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 10,
  },

  // En-tête de page
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#D4AF37",
  },
  headerLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
    textAlign: "center",
  },

  // Catégories
  categorySection: {
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#1a1a1a",
    padding: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#D4AF37",
  },

  // Grille de produits
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  // Carte produit
  productCard: {
    width: "48%",
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#FAFAFA",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  productImage: {
    width: 45,
    height: 45,
    objectFit: "cover",
    borderRadius: 3,
    marginBottom: 4,
    alignSelf: "center",
  },
  productName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 3,
  },
  productDescription: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 4,
    lineHeight: 1.2,
  },

  // Prix
  priceContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  priceSimple: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#D4AF37",
  },
  variantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  variantName: {
    fontSize: 7,
    color: "#666666",
  },
  variantPrice: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1a1a1a",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 10,
  },

  // Numéro de page
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 10,
    color: "#999999",
  },
});

// Page de couverture
const CoverPage = () => (
  <Page size="A4" style={styles.coverPage}>
    <Image
      src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/TransparentWhite.png`}
      style={styles.coverLogo}
    />
    <Text style={styles.coverSubtitle}>Notre Menu</Text>
    <Text style={styles.coverCity}>Marrakech</Text>
    <Text style={styles.coverYear}>{new Date().getFullYear()}</Text>
  </Page>
);

// Groupe de produits par catégorie
const ProductsByCategory = ({ category, products }: { category: string; products: Product[] }) => {
  // Diviser le nom de catégorie (ex: "Boissons - Cafés" → "Cafés")
  const categoryDisplay = category.split(" - ").pop() || category;

  return (
    <View style={styles.categorySection} wrap={false}>
      <Text style={styles.categoryTitle}>{categoryDisplay}</Text>
      <View style={styles.productGrid}>
        {products.map((product, index) => (
          <View key={index} style={styles.productCard}>
            {product.image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/${product.image}`}
                style={styles.productImage}
              />
            )}
            <Text style={styles.productName}>{product.name}</Text>
            {product.description && (
              <Text style={styles.productDescription}>
                {product.description}
              </Text>
            )}

            <View style={styles.priceContainer}>
              {product.variants && product.variants.length > 0 ? (
                // Produit avec variants
                product.variants.map((variant, vIndex) => (
                  <View key={vIndex} style={styles.variantRow}>
                    <Text style={styles.variantName}>
                      {variant.option1Value}
                      {variant.option2Value && ` - ${variant.option2Value}`}
                    </Text>
                    <Text style={styles.variantPrice}>{variant.price} Dh</Text>
                  </View>
                ))
              ) : (
                // Produit simple
                <Text style={styles.priceSimple}>
                  {product.price} Dh
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Document PDF complet
export const MenuPDF = ({ products }: MenuPDFProps) => {
  // Grouper les produits par catégorie (garder tous les produits)
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Ordre des catégories
  const categoryOrder = [
    "Boissons - Cafés",
    "Boissons - Boissons Lactées",
    "Boissons - Milkshakes",
    "Boissons - Spécialisées",
    "Boissons Ice Lactées",
    "Eaux & Soft Drinks",
    "Jus Frais Pressés",
    "Shots Vitaminés",
    "Desserts",
    "Desserts - Cans",
    "Briodogs Salés",
    "Briodogs Sucrés",
    "Modificateurs",
  ];

  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Diviser en sections principales pour une meilleure pagination
  const boissonsCategories = sortedCategories.filter((cat) =>
    cat.startsWith("Boissons") || cat.includes("Shots") || cat.includes("Jus") || cat.includes("Eaux")
  );
  const dessertsCategories = sortedCategories.filter((cat) =>
    cat.startsWith("Desserts")
  );
  const briodogsCategories = sortedCategories.filter((cat) =>
    cat.startsWith("Briodogs")
  );
  const modificateursCategories = sortedCategories.filter((cat) =>
    cat.startsWith("Modificateurs") || cat === "Autres"
  );

  return (
    <Document
      title="Menu Kech Waffles"
      author="Kech Waffles"
      subject="Menu complet"
      keywords="menu, kech waffles, marrakech"
    >
      {/* Page de couverture */}
      <CoverPage />

      {/* Boissons */}
      {boissonsCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Nos Boissons</Text>
          </View>
          {boissonsCategories.map((category) => (
            <ProductsByCategory
              key={category}
              category={category}
              products={productsByCategory[category]}
            />
          ))}
          <Text style={styles.footer}>
            Kech Waffles • Marrakech • www.kechwaffles.com
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber - 1}`}
            fixed
          />
        </Page>
      )}

      {/* Desserts */}
      {dessertsCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Nos Desserts</Text>
          </View>
          {dessertsCategories.map((category) => (
            <ProductsByCategory
              key={category}
              category={category}
              products={productsByCategory[category]}
            />
          ))}
          <Text style={styles.footer}>
            Kech Waffles • Marrakech • www.kechwaffles.com
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber - 1}`}
            fixed
          />
        </Page>
      )}

      {/* Briodogs */}
      {briodogsCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Nos Briodogs</Text>
          </View>
          {briodogsCategories.map((category) => (
            <ProductsByCategory
              key={category}
              category={category}
              products={productsByCategory[category]}
            />
          ))}
          <Text style={styles.footer}>
            Kech Waffles • Marrakech • www.kechwaffles.com
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber - 1}`}
            fixed
          />
        </Page>
      )}

      {/* Suppléments */}
      {modificateursCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
            />
            <Text style={styles.headerTitle}>Suppléments</Text>
          </View>
          {modificateursCategories.map((category) => (
            <ProductsByCategory
              key={category}
              category={category}
              products={productsByCategory[category]}
            />
          ))}
          <Text style={styles.footer}>
            Kech Waffles • Marrakech • www.kechwaffles.com
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber }) => `${pageNumber - 1}`}
            fixed
          />
        </Page>
      )}
    </Document>
  );
};
