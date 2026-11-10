import { prisma } from "@/lib/prisma";

/** The active catalogue in menu order: read by `/api/products`, the menu page and `llms.txt`. */
export function getMenuProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }, { name: "asc" }],
  });
}

/**
 * For the pages that render the catalogue on the server: `null` when the database does not
 * answer, so the page still builds and the menu falls back to fetching it in the browser.
 */
export async function tryGetMenuProducts() {
  try {
    return await getMenuProducts();
  } catch (error) {
    console.error("Catalogue indisponible au rendu serveur:", error);
    return null;
  }
}
