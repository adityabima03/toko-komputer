CREATE TABLE `categories` (
	`slug` varchar(64) NOT NULL,
	`name` varchar(120) NOT NULL,
	`group_name` varchar(64) NOT NULL,
	`sort_order` int NOT NULL,
	CONSTRAINT `categories_slug` PRIMARY KEY(`slug`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(64) NOT NULL,
	`name` varchar(190) NOT NULL,
	`slug` varchar(190) NOT NULL,
	`category` varchar(64) NOT NULL,
	`brand` varchar(120) NOT NULL,
	`price` int NOT NULL,
	`original_price` int,
	`rating` double NOT NULL DEFAULT 0,
	`sold` int NOT NULL DEFAULT 0,
	`stock` int NOT NULL DEFAULT 0,
	`specs` json NOT NULL DEFAULT ('[]'),
	`image` varchar(500) NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(64) NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(190) NOT NULL,
	`role` enum('admin','customer') NOT NULL DEFAULT 'customer',
	`password_hash` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_categories_slug_fk` FOREIGN KEY (`category`) REFERENCES `categories`(`slug`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;