CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`translucent` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`phone` text NOT NULL,
	`email` text,
	`city` text,
	`product` text,
	`quantity_kg` integer,
	`message` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`sku` text NOT NULL,
	`name` text NOT NULL,
	`category_id` integer NOT NULL,
	`short_description` text NOT NULL,
	`description` text NOT NULL,
	`price_per_kg` integer NOT NULL,
	`moq` integer NOT NULL,
	`pack_sizes` text NOT NULL,
	`features` text NOT NULL,
	`ingredients` text NOT NULL,
	`ph_level` text NOT NULL,
	`melt_point` text NOT NULL,
	`shelf_life` text NOT NULL,
	`color` text,
	`badge` text,
	`rating` real DEFAULT 4.8 NOT NULL,
	`in_stock` integer DEFAULT true NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);