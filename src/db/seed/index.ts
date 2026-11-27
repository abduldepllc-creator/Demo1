import "dotenv/config";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { categoryData, productData } from "./data";

async function main() {
  console.log("Seeding database...");

  // Reset catalogue tables (inquiries are kept)
  await db.delete(products);
  await db.delete(categories);

  const inserted = await db.insert(categories).values(categoryData).returning();
  const idBySlug = new Map(inserted.map((c) => [c.slug, c.id]));

  await db.insert(products).values(
    productData.map(({ category, ...p }) => {
      const categoryId = idBySlug.get(category);
      if (!categoryId) throw new Error(`Unknown category: ${category}`);
      return { ...p, categoryId };
    }),
  );

  console.log(`Seeded ${inserted.length} categories and ${productData.length} products.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
