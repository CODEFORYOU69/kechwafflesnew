import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isUserAdmin } from "@/lib/admin";
import { renderToStream } from "@react-pdf/renderer";
import { PosterPizzaWaffle } from "@/lib/pdf/poster-pizza-waffle";
import { PosterMenuClassic } from "@/lib/pdf/poster-menu-classic";
import { PosterCoffee } from "@/lib/pdf/poster-coffee";
import { PosterCans } from "@/lib/pdf/poster-cans";
import { PosterShotsJuice } from "@/lib/pdf/poster-shots-juice";
import { PosterSweetWaffles } from "@/lib/pdf/poster-sweet-waffles";
import { PosterRamadanJuice } from "@/lib/pdf/poster-ramadan-juice";

const POSTER_TYPES = [
  "pizza-waffle",
  "menu-classic",
  "coffee",
  "cans",
  "shots-juice",
  "sweet-waffles",
  "ramadan-juice",
] as const;

type PosterType = (typeof POSTER_TYPES)[number];

// Types that need products from DB
const TYPES_NEEDING_PRODUCTS: PosterType[] = ["menu-classic", "coffee", "cans"];

async function fetchProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isModifier: false },
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

  return products.map((product) => ({
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
}

type ProductData = Awaited<ReturnType<typeof fetchProducts>>;

function buildPoster(type: PosterType, productData?: ProductData) {
  switch (type) {
    case "pizza-waffle":
      return PosterPizzaWaffle();
    case "menu-classic":
      return PosterMenuClassic({ products: productData! });
    case "coffee":
      return PosterCoffee({ products: productData! });
    case "cans":
      return PosterCans({ products: productData! });
    case "shots-juice":
      return PosterShotsJuice();
    case "sweet-waffles":
      return PosterSweetWaffles();
    case "ramadan-juice":
      return PosterRamadanJuice();
    default:
      throw new Error(`Type de poster inconnu: ${type}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    let session;
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès admin requis" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as PosterType | null;

    if (!type || !POSTER_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type invalide. Types disponibles: ${POSTER_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    console.log(`🖼️ Génération du poster ${type}...`);

    let productData: Awaited<ReturnType<typeof fetchProducts>> | undefined;
    if (TYPES_NEEDING_PRODUCTS.includes(type)) {
      productData = await fetchProducts();
      console.log(`✅ ${productData.length} produits trouvés`);
    }

    const pdfDocument = buildPoster(type, productData);

    console.log("🔄 Rendu du poster en cours...");
    const stream = await renderToStream(pdfDocument);
    console.log("✅ Poster généré avec succès");

    const date = new Date().toISOString().split("T")[0];
    const filename = `poster-${type}-${date}.pdf`;

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la génération du poster:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la génération du poster",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
