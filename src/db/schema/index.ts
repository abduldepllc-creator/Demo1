import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  /** Base colour of the soap, used to render the product visual */
  color: text("color").notNull(),
  translucent: integer("translucent", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  /** Wholesale price in PKR per kg (base tier) */
  pricePerKg: integer("price_per_kg").notNull(),
  /** Minimum order quantity in kg */
  moq: integer("moq").notNull(),
  packSizes: text("pack_sizes", { mode: "json" }).$type<string[]>().notNull(),
  features: text("features", { mode: "json" }).$type<string[]>().notNull(),
  ingredients: text("ingredients").notNull(),
  phLevel: text("ph_level").notNull(),
  meltPoint: text("melt_point").notNull(),
  shelfLife: text("shelf_life").notNull(),
  /** Optional override colour for the product visual */
  color: text("color"),
  badge: text("badge"),
  rating: real("rating").notNull().default(4.8),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city"),
  product: text("product"),
  quantityKg: integer("quantity_kg"),
  message: text("message"),
  status: text("status", { enum: ["new", "contacted", "closed"] }).notNull().default("new"),
  createdAt: createdAt(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type ProductWithCategory = Product & { category: Category };
