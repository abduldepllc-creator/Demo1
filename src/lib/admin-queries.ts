import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { customers, products } from "@/db/schema";

/** Options for order forms. */
export async function getOrderFormOptions() {
  const [custs, prods] = await Promise.all([
    db
      .select({ id: customers.id, name: customers.name, company: customers.company, phone: customers.phone, email: customers.email, city: customers.city, address: customers.address })
      .from(customers)
      .orderBy(asc(customers.name)),
    db
      .select({ id: products.id, name: products.name, sku: products.sku, pricePerKg: products.pricePerKg, moq: products.moq, stockKg: products.stockKg })
      .from(products)
      .orderBy(asc(products.name)),
  ]);
  return { customers: custs, products: prods };
}
