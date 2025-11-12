/**
 * Script pour ajouter le Thé à la Menthe à Loyverse et la BDD
 * Usage: pnpm tsx scripts/add-the-menthe.ts
 */

import { createLoyverseItem, uploadLoyverseItemImage } from "@/lib/loyalty/loyverse";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function addTheMenthe() {
  console.log("🍵 Ajout du Thé à la Menthe...\n");

  try {
    // 1. Créer le produit dans Loyverse avec variants
    console.log("📤 Création dans Loyverse...");

    // On doit créer avec des variants - utiliser l'API directement
    const LOYVERSE_API_URL = "https://api.loyverse.com/v1.0";

    // Récupérer le token
    const config = await prisma.loyverseConfig.findUnique({
      where: { id: "singleton" },
    });

    if (!config) {
      throw new Error("Loyverse not connected");
    }

    const loyverseProduct = {
      item_name: "Thé à la Menthe",
      category_id: null,
      track_stock: false,
      sold_by_weight: false,
      is_composite: false,
      use_production: false,
      components: [],
      primary_supplier_id: null,
      tax_ids: [],
      supplier_item_ids: [],
      modifiers_ids: [],
      variants: [
        {
          variant_name: "Petit",
          sku: "THE-MEN-P",
          reference_id: "THE-MEN-P",
          price: 10,
          option1_value: "Petit",
        },
        {
          variant_name: "Grand",
          sku: "THE-MEN-G",
          reference_id: "THE-MEN-G",
          price: 15,
          option1_value: "Grand",
        },
      ],
      option1_name: "Taille",
    };

    const response = await fetch(`${LOYVERSE_API_URL}/items`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loyverseProduct),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Loyverse API error: ${error}`);
    }

    const item = await response.json();

    console.log("✅ Produit créé dans Loyverse avec succès !");
    console.log(`   ID Loyverse: ${item.id}`);
    console.log(`   Nom: ${item.item_name}`);
    console.log(`   Variants: ${item.variants.length}`);

    // 2. Créer le produit dans la BDD
    console.log("\n📝 Création dans la base de données...");

    const product = await prisma.product.create({
      data: {
        handle: "the-menthe",
        sku: "THE-MEN",
        name: "Thé à la Menthe",
        category: "Boissons - Spécialisées",
        description: "Thé à la menthe traditionnel",
        image: "waffles.png",
        price: null,
        isActive: true,
        isModifier: false,
        displayOrder: 0,
        loyverseItemId: item.id,
        variants: {
          create: [
            {
              variantSku: "THE-MEN-P",
              option1Name: "Taille",
              option1Value: "Petit",
              option2Name: null,
              option2Value: null,
              price: 10,
              isActive: true,
              loyverseVariantId: item.variants[0].variant_id,
            },
            {
              variantSku: "THE-MEN-G",
              option1Name: "Taille",
              option1Value: "Grand",
              option2Name: null,
              option2Value: null,
              price: 15,
              isActive: true,
              loyverseVariantId: item.variants[1].variant_id,
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    });

    console.log(`✅ Créé dans la BDD: ${product.id}`);
    console.log(`   - Nom: ${product.name}`);
    console.log(`   - Variants: ${product.variants.length}`);
    product.variants.forEach((v) => {
      console.log(`      ${v.option1Value}: ${v.price} Dh`);
    });
    console.log(`   - Loyverse ID: ${product.loyverseItemId}`);

    console.log("\n🎉 Thé à la Menthe ajouté avec succès!");
  } catch (error) {
    console.error("❌ Erreur:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    throw error;
  }
}

addTheMenthe()
  .then(() => {
    console.log("\n✅ Script terminé!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
