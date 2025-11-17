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

// Enregistrer les polices locales
Font.register({
  family: "Great Vibes",
  src: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/fonts/GreatVibes-Regular.ttf`,
});

Font.register({
  family: "Montserrat",
  src: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/fonts/Montserrat-VariableFont_wght.ttf`,
});

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
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
    backgroundColor: "#F5F5DC",
    fontFamily: "Montserrat",
  },

  // Page de couverture
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  coverLogo: {
    width: 200,
    height: 200,
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
    fontFamily: "Montserrat",
    color: "#000000",
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
    fontFamily: "Montserrat",
    color: "#FFFFFF",
    backgroundColor: "#000000",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 6,
    paddingRight: 6,
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
    width: 35,
    height: 35,
    objectFit: "cover",
    borderRadius: 3,
    marginBottom: 4,
    alignSelf: "center",
  },
  productName: {
    fontSize: 10,
    fontFamily: "Montserrat",
    color: "#000000",
    marginBottom: 3,
  },
  productDescription: {
    fontSize: 8,
    fontFamily: "Montserrat",
    color: "#000000",
    marginBottom: 4,
    lineHeight: 1.2,
  },

  // Prix
  priceContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  priceSimple: {
    fontSize: 11,
    fontFamily: "Montserrat",
    color: "#000000",
  },
  variantRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  variantName: {
    fontSize: 8,
    fontFamily: "Montserrat",
    color: "#000000",
  },
  variantPrice: {
    fontSize: 9,
    fontFamily: "Montserrat",
    color: "#000000",
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

  // Page de présentation
  presentationPage: {
    padding: 50,
    backgroundColor: "#F5F5DC",
  },
  presentationTitle: {
    fontSize: 32,
    fontFamily: "Great Vibes",
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#D4AF37",
    paddingBottom: 10,
  },
  presentationSection: {
    marginBottom: 15,
  },
  presentationSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "Great Vibes",
    color: "#000000",
    marginBottom: 8,
  },
  presentationText: {
    fontSize: 9,
    fontFamily: "Montserrat",
    fontWeight: 400,
    color: "#000000",
    lineHeight: 1.5,
    textAlign: "justify",
  },
  presentationList: {
    fontSize: 8,
    fontFamily: "Montserrat",
    fontWeight: 400,
    color: "#000000",
    lineHeight: 1.6,
    marginLeft: 10,
  },

  // Page de fin
  endPage: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 60,
  },
  endLogo: {
    width: 150,
    height: 150,
    marginTop: 200,
  },
  endInfoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  endTitle: {
    fontSize: 20,
    fontFamily: "Great Vibes",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  endInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  endInfoLabel: {
    fontSize: 10,
    fontWeight: 700,
    fontFamily: "Montserrat",
    color: "#D4AF37",
    width: 80,
  },
  endInfoText: {
    fontSize: 10,
    fontFamily: "Montserrat",
    fontWeight: 400,
    color: "#FFFFFF",
  },
});

// Page de couverture
const CoverPage = () => (
  <Page size="A4" style={styles.coverPage}>
    {/* eslint-disable-next-line jsx-a11y/alt-text */}
    <Image
      src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/TransparentWhite.png`}
      style={styles.coverLogo}
      cache
    />
    <Text style={styles.coverSubtitle}>Notre Menu</Text>
    <Text style={styles.coverCity}>Marrakech</Text>
    <Text style={styles.coverYear}>{new Date().getFullYear()}</Text>
  </Page>
);

// Page de présentation
const PresentationPage = () => (
  <Page size="A4" style={styles.presentationPage}>
    <Text style={styles.presentationTitle}>Kech Waffles - L&apos;art de la gaufre à Marrakech</Text>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationSectionTitle}>Notre Philosophie : Le Fait Maison Avant Tout</Text>
      <Text style={styles.presentationText}>
        Chez Kech Waffles, chaque gaufre est une création unique, préparée avec amour et patience.
        Nous croyons en la valeur du fait maison et refusons tout compromis sur la qualité.
      </Text>
    </View>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationList}>• Pâtes préparées quotidiennement dans notre laboratoire</Text>
      <Text style={styles.presentationList}>• Sauces chocolat & pistache créées maison avec recettes exclusives</Text>
      <Text style={styles.presentationList}>• Garnitures fraîches sélectionnées chaque matin</Text>
      <Text style={styles.presentationList}>• Cuisson minute pour une fraîcheur incomparable</Text>
      <Text style={styles.presentationList}>• Glaces artisanales préparées avec soin</Text>
    </View>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationSectionTitle}>Des Ingrédients d&apos;Exception</Text>
      <Text style={styles.presentationText}>
        Notre engagement : n&apos;utiliser que les meilleurs produits pour vous offrir une expérience gustative inoubliable.
      </Text>
    </View>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationList}>• CHOCOLAT CALLEBAUT (Belgique) - Le chocolat des plus grands chocolatiers du monde</Text>
      <Text style={styles.presentationList}>• CRÈME PISTACHE DE QUALITÉ - Une crème pistache authentique au goût intense</Text>
      <Text style={styles.presentationList}>• MASCARPONE DE QUALITÉ - Pour notre crème tiramisu maison</Text>
      <Text style={styles.presentationList}>• PERLES DE SUCRE - Pour nos gaufres liégeoises authentiques</Text>
    </View>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationSectionTitle}>Nos Créations Signature</Text>
      <Text style={styles.presentationList}>• PIZZA WAFFLES - Notre concept innovant qui fusionne l&apos;Italie et la Belgique</Text>
      <Text style={styles.presentationList}>• POTATO WAFFLES - Notre création originale avec pommes de terre</Text>
      <Text style={styles.presentationList}>• BUBBLE WAFFLES - Le dessert tendance de Hong Kong revisité</Text>
      <Text style={styles.presentationList}>• TIRAMISU WAFFLE - Notre création exclusive avec crème tiramisu maison</Text>
    </View>

    <View style={styles.presentationSection}>
      <Text style={styles.presentationSectionTitle}>Notre Engagement Qualité</Text>
      <Text style={styles.presentationList}>✓ FRAÎCHEUR GARANTIE - Pâtes préparées le jour même, cuisson minute</Text>
      <Text style={styles.presentationList}>✓ INGRÉDIENTS NOBLES - Les meilleurs produits du Maroc et d&apos;ailleurs</Text>
      <Text style={styles.presentationList}>✓ TRANSPARENCE TOTALE - Nous sommes fiers de nos recettes</Text>
      <Text style={styles.presentationList}>✓ FAIT MAISON VÉRITABLE - Pas de poudres industrielles</Text>
      <Text style={styles.presentationList}>✓ HYGIÈNE IRRÉPROCHABLE - Laboratoire aux normes</Text>
    </View>
  </Page>
);

// Page de fin
const EndPage = () => (
  <Page size="A4" style={styles.endPage}>
    <View style={{ flex: 1 }} />
    {/* eslint-disable-next-line jsx-a11y/alt-text */}
    <Image
      src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/TransparentWhite.png`}
      style={styles.endLogo}
      cache
    />
    <View style={styles.endInfoContainer}>
      <Text style={styles.endTitle}>Où nous trouver</Text>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Adresse :</Text>
        <Text style={styles.endInfoText}>MAG 33 AL BADII, Marrakech, Maroc</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Instagram :</Text>
        <Text style={styles.endInfoText}>@kechwaffles</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>Facebook :</Text>
        <Text style={styles.endInfoText}>kechwaffles</Text>
      </View>
      <View style={styles.endInfoRow}>
        <Text style={styles.endInfoLabel}>TikTok :</Text>
        <Text style={styles.endInfoText}>@kechwaffles</Text>
      </View>
    </View>
  </Page>
);

// Groupe de produits par catégorie
const ProductsByCategory = ({ category, products }: { category: string; products: Product[] }) => {
  // Diviser le nom de catégorie (ex: "Boissons - Cafés" → "Cafés")
  let categoryDisplay = category.split(" - ").pop() || category;

  // Remplacer "Modificateurs" par "Suppléments"
  if (categoryDisplay === "Modificateurs") {
    categoryDisplay = "Suppléments";
  }

  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{categoryDisplay}</Text>
      <View style={styles.productGrid}>
        {products.map((product, index) => (
          <View key={index} style={styles.productCard} wrap={false}>
            {product.image && (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/${product.image}`}
                style={styles.productImage}
                cache
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
  // Liste des suppléments salés
  const supplementsSales = [
    "extra jambon",
    "extra mozzarella",
    "extra olives",
    "extra pepperoni",
    "extra poulet",
    "extra thon",
    "extra viande hachée",
    "fromage cheddar",
    "oignons caramélisés",
    "sauce gruyère lyonnaise",
    "sauce harissa",
    "sauce mayo",
    "sauce pesto",
    "saucisse extra",
    "fromage mozzarella",
  ];

  // Regrouper les produits selon les nouvelles règles
  const productsByCategory = products.reduce((acc, product) => {
    let targetCategory = product.category;

    // Fusionner "Jus Frais Pressés" dans "Eaux & Soft Drinks"
    if (product.category === "Jus Frais Pressés") {
      targetCategory = "Eaux & Soft Drinks";
    }

    // Séparer "Boissons - Spécialisées"
    if (product.category === "Boissons - Spécialisées") {
      // Thé à la menthe va dans "Autres Boissons Chaudes"
      if (product.name.toLowerCase().includes("thé") || product.name.toLowerCase().includes("menthe")) {
        targetCategory = "Autres Boissons Chaudes";
      } else {
        // Autres produits spécialisés vont dans "Boissons - Boissons Lactées"
        targetCategory = "Boissons - Boissons Lactées";
      }
    }

    // Séparer les modificateurs en Salés et Sucrés
    if (product.category === "Modificateurs") {
      const productNameLower = product.name.toLowerCase();
      const isSale = supplementsSales.some(supplement =>
        productNameLower.includes(supplement)
      );

      if (isSale) {
        targetCategory = "Suppléments Salés";
      } else {
        targetCategory = "Suppléments Sucrés";
      }
    }

    if (!acc[targetCategory]) {
      acc[targetCategory] = [];
    }
    acc[targetCategory].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Ordre des catégories
  const categoryOrder = [
    "Potato Waffles",
    "Pizza Waffles",
    "Suppléments Salés",
    "Desserts",
    "Desserts - Cans",
    "Boissons - Cafés",
    "Autres Boissons Chaudes",
    "Boissons - Boissons Lactées",
    "Boissons - Milkshakes",
    "Boissons Ice Lactées",
    "Eaux & Soft Drinks",
    "Shots Vitaminés",
    "Suppléments Sucrés",
    "Modificateurs",
  ];

  const sortedCategories = Object.keys(productsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Grouper les sections pour optimiser la pagination
  // Chaque groupe commence en début de page
  const cafesCategories = sortedCategories.filter((cat) =>
    cat === "Boissons - Cafés"
  );
  const autresBoissonsChaudesCategories = sortedCategories.filter((cat) =>
    cat === "Autres Boissons Chaudes"
  );
  const boissonsLacteesCategories = sortedCategories.filter((cat) =>
    cat === "Boissons - Boissons Lactées"
  );
  const milkshakesCategories = sortedCategories.filter((cat) =>
    cat === "Boissons - Milkshakes"
  );
  const boissonsIceCategories = sortedCategories.filter((cat) =>
    cat === "Boissons Ice Lactées"
  );
  const eauxJusCategories = sortedCategories.filter((cat) =>
    cat === "Eaux & Soft Drinks"
  );
  const shotsCategories = sortedCategories.filter((cat) =>
    cat.includes("Shots")
  );
  const dessertsCategories = sortedCategories.filter((cat) =>
    cat === "Desserts"
  );
  const dessertsCansCategories = sortedCategories.filter((cat) =>
    cat === "Desserts - Cans"
  );
  const pizzaWafflesCategories = sortedCategories.filter((cat) =>
    cat === "Pizza Waffles"
  );
  const potatoWafflesCategories = sortedCategories.filter((cat) =>
    cat === "Potato Waffles"
  );
  const supplementsSalesCategories = sortedCategories.filter((cat) =>
    cat === "Suppléments Salés"
  );
  const supplementsSucresCategories = sortedCategories.filter((cat) =>
    cat === "Suppléments Sucrés"
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

      {/* Page de présentation */}
      <PresentationPage />

      {/* Potato Waffles - Page 1 */}
      {potatoWafflesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Potato Waffles</Text>
          </View>
          {potatoWafflesCategories.map((category) => (
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

      {/* Pizza Waffles - Page 2 */}
      {pizzaWafflesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Pizza Waffles</Text>
          </View>
          {pizzaWafflesCategories.map((category) => (
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

      {/* Suppléments Salés - Page 3 */}
      {supplementsSalesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Suppléments Salés</Text>
          </View>
          {supplementsSalesCategories.map((category) => (
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

      {/* Desserts - Page 4 */}
      {dessertsCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
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

      {/* Desserts - Cans - Page 5 */}
      {dessertsCansCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Nos Canettes</Text>
          </View>
          {dessertsCansCategories.map((category) => (
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

      {/* Cafés & Autres Boissons Chaudes - Page 6 */}
      {cafesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Nos Boissons</Text>
          </View>
          {cafesCategories.map((category) => (
            <ProductsByCategory
              key={category}
              category={category}
              products={productsByCategory[category]}
            />
          ))}
          {autresBoissonsChaudesCategories.map((category) => (
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

      {/* Boissons Lactées - Page 7 */}
      {boissonsLacteesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Nos Boissons Lactées</Text>
          </View>
          {boissonsLacteesCategories.map((category) => (
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

      {/* Milkshakes - Page 8 */}
      {milkshakesCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Nos Milkshakes</Text>
          </View>
          {milkshakesCategories.map((category) => (
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

      {/* Boissons Ice Lactées - Page 9 */}
      {boissonsIceCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Boissons Ice Lactées</Text>
          </View>
          {boissonsIceCategories.map((category) => (
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

      {/* Eaux & Soft Drinks - Page 10 */}
      {eauxJusCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Eaux, Soft Drinks & Jus Frais</Text>
          </View>
          {eauxJusCategories.map((category) => (
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

      {/* Shots Vitaminés - Page 11 */}
      {shotsCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Shots Vitaminés</Text>
          </View>
          {shotsCategories.map((category) => (
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

      {/* Suppléments Sucrés - Page 12 */}
      {supplementsSucresCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
            />
            <Text style={styles.headerTitle}>Suppléments Sucrés</Text>
          </View>
          {supplementsSucresCategories.map((category) => (
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

      {/* Anciens modificateurs (fallback) */}
      {modificateursCategories.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header} wrap={false}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.kechwaffles.com'}/images/menu-items/transparentlogo.jpg`}
              style={styles.headerLogo}
              cache
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

      {/* Page de fin avec informations de contact */}
      <EndPage />
    </Document>
  );
};
