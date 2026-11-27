/**
 * Seed the database with the SoapBase catalogue and sample admin data.
 *
 *   npm run db:seed          → seeds only if the database is empty (safe to re-run)
 *   npm run db:seed -- --reset → WIPES all data and seeds again
 */
import { eq, sql } from "drizzle-orm";
import * as s from "../../src/db/schema";
import { createScriptDb } from "../client";
import { OPENING_STOCK, categoryData, productData } from "./catalog";
import { sampleCustomers, sampleInquiries, sampleOrders, sampleReviews, sampleSubscribers } from "./samples";

const reset = process.argv.includes("--reset");

/** Same tier discounts as the public price calculator (src/lib/pricing.ts) */
function tierPrice(base: number, qty: number) {
  const discount = qty >= 1000 ? 0.12 : qty >= 500 ? 0.08 : qty >= 100 ? 0.05 : 0;
  return Math.round(base * (1 - discount));
}

export async function seed() {
  const { db, client } = createScriptDb();
  try {
    if (reset) {
      console.log("• Resetting all tables…");
      await db.execute(sql`TRUNCATE stock_movements, order_items, orders, customers, reviews, products, categories, inquiries, newsletter_subscribers RESTART IDENTITY CASCADE`);
    }

    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(s.categories);
    if (count > 0) {
      console.log("✓ Database already has data, skipping seed (use `npm run db:seed -- --reset` to start fresh).");
      return;
    }

    console.log("• Seeding categories & products…");
    const cats = await db.insert(s.categories).values(categoryData).returning();
    const catId = new Map(cats.map((c) => [c.slug, c.id]));

    const prods = await db
      .insert(s.products)
      .values(
        productData.map(({ category, ...p }) => {
          const categoryId = catId.get(category);
          if (!categoryId) throw new Error(`Unknown category ${category}`);
          return { ...p, categoryId, stockKg: OPENING_STOCK[p.sku] ?? 500, rating: 0, reviewCount: 0 };
        }),
      )
      .returning();
    const bySku = new Map(prods.map((p) => [p.sku, p]));

    console.log("• Opening stock…");
    await db.insert(s.stockMovements).values(
      prods.map((p) => ({ productId: p.id, type: "in" as const, quantityKg: p.stockKg, balanceKg: p.stockKg, reason: "Opening stock" })),
    );

    console.log("• Reviews…");
    await db.insert(s.reviews).values(
      sampleReviews.map((r) => ({
        productId: bySku.get(r.sku)!.id,
        name: r.name,
        company: r.company,
        city: r.city,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        status: r.status ?? ("approved" as const),
      })),
    );
    // Sync product rating / review count from approved reviews
    await db.execute(sql`
      UPDATE products p SET
        rating = COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 1) FROM reviews r WHERE r.product_id = p.id AND r.status = 'approved'), 0),
        review_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id AND r.status = 'approved')`);

    console.log("• Customers & orders…");
    const custs = await db.insert(s.customers).values(sampleCustomers).returning();
    let n = 0;
    for (const o of sampleOrders) {
      const c = custs[o.customer];
      const created = new Date();
      created.setMonth(created.getMonth() - o.monthsAgo);
      created.setDate(Math.max(1, created.getDate() - 3 * (n % 4)));
      const items = o.items.map(([sku, qty]) => {
        const p = bySku.get(sku)!;
        const unit = tierPrice(p.pricePerKg, qty);
        return { productId: p.id, productName: p.name, sku: p.sku, quantityKg: qty, unitPrice: unit, lineTotal: unit * qty };
      });
      const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
      n += 1;
      const [order] = await db
        .insert(s.orders)
        .values({
          orderNumber: `SB-${created.getFullYear()}-${String(n).padStart(4, "0")}`,
          customerId: c.id,
          customerName: c.name,
          company: c.company,
          phone: c.phone,
          email: c.email,
          city: c.city,
          address: c.address,
          status: o.status,
          paymentStatus: o.payment,
          subtotal,
          deliveryFee: o.deliveryFee,
          total: subtotal + o.deliveryFee,
          // Historic (delivered/shipped) orders came out of stock before the opening count
          stockDeducted: o.status !== "pending",
          createdAt: created,
          updatedAt: created,
        })
        .returning();
      await db.insert(s.orderItems).values(items.map((i) => ({ ...i, orderId: order.id })));
    }

    console.log("• Enquiries & newsletter…");
    await db.insert(s.inquiries).values(sampleInquiries);
    await db.insert(s.newsletterSubscribers).values(sampleSubscribers.map((email) => ({ email, source: "website" })));

    const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(s.products).where(eq(s.products.isActive, true));
    console.log(`✓ Seeded ${cats.length} categories, ${total} products, ${sampleReviews.length} reviews, ${custs.length} customers, ${sampleOrders.length} orders.`);
  } finally {
    await client.end();
  }
}

// Run directly: `tsx db/seed/index.ts`
if (process.argv[1]?.replace(/\\/g, "/").endsWith("db/seed/index.ts")) {
  seed().catch((err) => {
    console.error("✖ Seed failed:", err);
    process.exit(1);
  });
}
