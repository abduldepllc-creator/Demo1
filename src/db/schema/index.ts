import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/*
 * Every table has Row Level Security enabled with no policies.
 * Supabase exposes the `public` schema through its REST API, so RLS keeps the data
 * unreachable via the anon/public key. The app connects with the database role
 * (DATABASE_URL), which bypasses RLS, so server code is unaffected.
 */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// ─── Enums ──────────────────────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "partial", "paid", "refunded"]);
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "contacted", "quoted", "converted", "closed"]);
export const subscriberStatusEnum = pgEnum("subscriber_status", ["subscribed", "unsubscribed"]);
export const stockMovementTypeEnum = pgEnum("stock_movement_type", ["in", "out", "adjustment"]);

export const ORDER_STATUSES = orderStatusEnum.enumValues;
export const PAYMENT_STATUSES = paymentStatusEnum.enumValues;
export const REVIEW_STATUSES = reviewStatusEnum.enumValues;
export const INQUIRY_STATUSES = inquiryStatusEnum.enumValues;
export const SUBSCRIBER_STATUSES = subscriberStatusEnum.enumValues;
export const STOCK_MOVEMENT_TYPES = stockMovementTypeEnum.enumValues;

export type CategoryBenefit = { title: string; text: string };

// ─── Catalogue ──────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  /** Base colour of the soap, used to draw the product visual when there is no photo */
  color: text("color").notNull().default("#cfeef5"),
  translucent: boolean("translucent").notNull().default(false),
  imageUrl: text("image_url"),
  /** Category landing page content */
  headline: text("headline").notNull().default(""),
  benefits: jsonb("benefits").$type<CategoryBenefit[]>().notNull().default([]),
  applications: jsonb("applications").$type<string[]>().notNull().default([]),
  proTip: text("pro_tip").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
}).enableRLS();

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    sku: text("sku").notNull().unique(),
    name: text("name").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    shortDescription: text("short_description").notNull().default(""),
    description: text("description").notNull().default(""),
    /** Wholesale price in PKR per kg (base tier) */
    pricePerKg: integer("price_per_kg").notNull(),
    /** Minimum order quantity in kg */
    moq: integer("moq").notNull().default(25),
    packSizes: jsonb("pack_sizes").$type<string[]>().notNull().default([]),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    ingredients: text("ingredients").notNull().default(""),
    phLevel: text("ph_level").notNull().default(""),
    meltPoint: text("melt_point").notNull().default(""),
    shelfLife: text("shelf_life").notNull().default(""),
    /** Optional override colour for the drawn soap visual */
    color: text("color"),
    /** Public image URLs (Supabase Storage). The first image is the cover. */
    images: jsonb("images").$type<string[]>().notNull().default([]),
    badge: text("badge"),
    /** Average of approved reviews (kept in sync automatically) */
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    /** Stock on hand in kg */
    stockKg: integer("stock_kg").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(100),
    featured: boolean("featured").notNull().default(false),
    /** Unpublished products are hidden from the public site */
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
).enableRLS();

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    company: text("company"),
    city: text("city"),
    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment").notNull(),
    status: reviewStatusEnum("status").notNull().default("pending"),
    ...timestamps,
  },
  (t) => [index("reviews_product_idx").on(t.productId), index("reviews_status_idx").on(t.status)],
).enableRLS();

// ─── Customers & orders ─────────────────────────────────────────────────
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone").notNull(),
  city: text("city"),
  address: text("address"),
  notes: text("notes"),
  ...timestamps,
}).enableRLS();

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
    // Snapshot of customer details at the time of the order
    customerName: text("customer_name").notNull(),
    company: text("company"),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city"),
    address: text("address"),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("unpaid"),
    subtotal: integer("subtotal").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    deliveryFee: integer("delivery_fee").notNull().default(0),
    total: integer("total").notNull().default(0),
    notes: text("notes"),
    /** True once stock has been deducted for this order (prevents double deduction) */
    stockDeducted: boolean("stock_deducted").notNull().default(false),
    inquiryId: integer("inquiry_id"),
    ...timestamps,
  },
  (t) => [index("orders_status_idx").on(t.status), index("orders_customer_idx").on(t.customerId)],
).enableRLS();

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
    productName: text("product_name").notNull(),
    sku: text("sku"),
    quantityKg: integer("quantity_kg").notNull(),
    unitPrice: integer("unit_price").notNull(),
    lineTotal: integer("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
).enableRLS();

// ─── Stock ──────────────────────────────────────────────────────────────
export const stockMovements = pgTable(
  "stock_movements",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: stockMovementTypeEnum("type").notNull(),
    /** Signed change in kg (+ in, − out) */
    quantityKg: integer("quantity_kg").notNull(),
    /** Stock level after this movement */
    balanceKg: integer("balance_kg").notNull(),
    reason: text("reason"),
    orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("stock_movements_product_idx").on(t.productId)],
).enableRLS();

// ─── Leads & marketing ──────────────────────────────────────────────────
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city"),
  product: text("product"),
  quantityKg: integer("quantity_kg"),
  message: text("message"),
  status: inquiryStatusEnum("status").notNull().default("new"),
  ...timestamps,
}).enableRLS();

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  status: subscriberStatusEnum("status").notNull().default("subscribed"),
  source: text("source").notNull().default("website"),
  ...timestamps,
}).enableRLS();

// ─── Relations ──────────────────────────────────────────────────────────
export const categoriesRelations = relations(categories, ({ many }) => ({ products: many(products) }));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  reviews: many(reviews),
  stockMovements: many(stockMovements),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

export const customersRelations = relations(customers, ({ many }) => ({ orders: many(orders) }));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, { fields: [stockMovements.productId], references: [products.id] }),
  order: one(orders, { fields: [stockMovements.orderId], references: [orders.id] }),
}));

// ─── Types ──────────────────────────────────────────────────────────────
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type Subscriber = typeof newsletterSubscribers.$inferSelect;
export type ProductWithCategory = Product & { category: Category };
export type OrderStatus = Order["status"];
export type PaymentStatus = Order["paymentStatus"];
