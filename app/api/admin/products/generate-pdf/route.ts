import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { renderToStream } from "@react-pdf/renderer";
import { MenuPDF } from "@/lib/pdf/menu-pdf";

/**
 * GET: Génère et télécharge le PDF du menu
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès admin requis" },
        { status: 403 }
      );
    }

    console.log("📄 Génération du PDF du menu...");

    // Récupérer tous les produits actifs avec leurs variants
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isModifier: false, // Exclure les modificateurs de la liste principale
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { category: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    });

    // Récupérer les modificateurs séparément
    const modifiers = await prisma.product.findMany({
      where: {
        isActive: true,
        isModifier: true,
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: [
        { category: "asc" },
        { displayOrder: "asc" },
        { name: "asc" },
      ],
    });

    // Combiner les produits et modificateurs
    const allProducts = [...products, ...modifiers];

    console.log(`✅ ${allProducts.length} produits trouvés`);

    // Transformer les données pour le PDF
    const pdfData = allProducts.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      variants: product.variants.map((v) => ({
        option1Name: v.option1Name,
        option1Value: v.option1Value,
        option2Name: v.option2Name,
        option2Value: v.option2Value,
        price: v.price,
      })),
    }));

    // Générer le PDF
    const pdfDocument = MenuPDF({
      products: pdfData,
      generatedAt: new Date().toISOString(),
    });

    console.log("🔄 Rendu du PDF en cours...");

    // Convertir en stream
    const stream = await renderToStream(pdfDocument);

    console.log("✅ PDF généré avec succès");

    // Créer un nom de fichier avec la date
    const date = new Date().toISOString().split("T")[0];
    const filename = `menu-kech-waffles-${date}.pdf`;

    // Retourner le PDF en stream
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la génération du PDF:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du PDF",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
