/**
 * Script principal de seed pour la CAN 2025
 * Exécute tous les seeds dans le bon ordre
 */

import { PrismaClient } from "@prisma/client";
import { seedTeams } from "./seeds/teams";
import { seedGroupStageMatches } from "./seeds/matches";
import { seedPlayers } from "./seeds/players";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seed...\n");

  try {
    // 1. Seed Teams
    await seedTeams();
    console.log("");

    // 2. Seed Players
    await seedPlayers();
    console.log("");

    // 3. Seed Group Stage Matches
    await seedGroupStageMatches();
    console.log("");

    // 4. Seed Loyalty Rewards (Catalogue fidélité)
    console.log("🎁 Seeding loyalty rewards catalog...");

    const rewardsData = [
      {
        name: "Café Gratuit",
        description: "Un café de votre choix offert",
        pointsCost: 50,
        isActive: true,
        stockLimit: 100,
        currentStock: 100,
      },
      {
        name: "Gaufre 50% off",
        description: "50% de réduction sur une gaufre de votre choix",
        pointsCost: 100,
        isActive: true,
        stockLimit: 50,
        currentStock: 50,
      },
      {
        name: "Smoothie Gratuit",
        description: "Un smoothie au choix offert",
        pointsCost: 75,
        isActive: true,
        stockLimit: 80,
        currentStock: 80,
      },
      {
        name: "Menu Complet -30%",
        description: "30% de réduction sur un menu complet (entrée + plat + dessert)",
        pointsCost: 150,
        isActive: true,
        stockLimit: 30,
        currentStock: 30,
      },
      {
        name: "Dessert Gratuit",
        description: "Un dessert de votre choix offert",
        pointsCost: 80,
        isActive: true,
        stockLimit: 60,
        currentStock: 60,
      },
    ];

    for (const reward of rewardsData) {
      const existing = await prisma.loyaltyReward.findFirst({
        where: { name: reward.name },
      });

      if (!existing) {
        await prisma.loyaltyReward.create({ data: reward });
        console.log(`✅ Loyalty reward created: ${reward.name} (${reward.pointsCost} pts)`);
      } else {
        console.log(`ℹ️  Loyalty reward already exists: ${reward.name}`);
      }
    }

    console.log("");

    // 5. Create default admin users (si besoin)
    console.log("👤 Creating default admins...");

    const adminUsers = [
      {
        email: "admin@kech-waffles.com",
        name: "Admin Kech Waffles",
      },
      {
        email: "y.ouasmi@gmail.com",
        name: "Younes Ouasmi",
      },
    ];

    for (const admin of adminUsers) {
      const existingAdmin = await prisma.user.findUnique({
        where: { email: admin.email },
      });

      if (!existingAdmin) {
        await prisma.user.create({
          data: {
            email: admin.email,
            name: admin.name,
            role: "ADMIN",
            emailVerified: true,
          },
        });
        console.log(`✅ Admin user created: ${admin.email}`);
      } else {
        // Mettre à jour le rôle si l'utilisateur existe déjà
        await prisma.user.update({
          where: { email: admin.email },
          data: { role: "ADMIN" },
        });
        console.log(`ℹ️  Admin already exists (role updated): ${admin.email}`);
      }
    }

    console.log(`   ⚠️  Set password via Better Auth (/concours/auth)`);

    console.log("\n✅ All seeds completed successfully!");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
