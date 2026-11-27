import "server-only";
import { eq, sql } from "drizzle-orm";
import type { db } from "@/db";
import { orderItems, orders, products, stockMovements, type OrderStatus } from "@/db/schema";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Order statuses at which the goods are considered committed (stock deducted). */
export const DEDUCTING_STATUSES: OrderStatus[] = ["confirmed", "processing", "shipped", "delivered"];

/** Change a product's stock by `delta` kg and log the movement. Returns the new balance. */
export async function moveStock(
  tx: Tx,
  productId: number,
  delta: number,
  type: "in" | "out" | "adjustment",
  reason: string,
  orderId: number | null = null,
) {
  const [row] = await tx
    .update(products)
    .set({ stockKg: sql`${products.stockKg} + ${delta}` })
    .where(eq(products.id, productId))
    .returning({ stockKg: products.stockKg });
  if (!row) return null;
  await tx.insert(stockMovements).values({ productId, type, quantityKg: delta, balanceKg: row.stockKg, reason, orderId });
  return row.stockKg;
}

/**
 * Keep stock in sync with an order's status:
 * deduct once when it reaches a committed status, restore when it goes back to pending/cancelled.
 */
export async function syncOrderStock(tx: Tx, orderId: number, nextStatus: OrderStatus) {
  const order = await tx.query.orders.findFirst({ where: eq(orders.id, orderId), columns: { stockDeducted: true, orderNumber: true } });
  if (!order) return;
  const shouldDeduct = DEDUCTING_STATUSES.includes(nextStatus);
  if (shouldDeduct === order.stockDeducted) return;

  const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const item of items) {
    if (!item.productId) continue;
    if (shouldDeduct) {
      await moveStock(tx, item.productId, -item.quantityKg, "out", `Order ${order.orderNumber}`, orderId);
    } else {
      await moveStock(tx, item.productId, item.quantityKg, "in", `Order ${order.orderNumber} ${nextStatus === "cancelled" ? "cancelled" : "returned to pending"}`, orderId);
    }
  }
  await tx.update(orders).set({ stockDeducted: shouldDeduct }).where(eq(orders.id, orderId));
}
