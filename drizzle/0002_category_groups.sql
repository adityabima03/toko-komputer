ALTER TABLE `categories` ADD `group_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `sort_order` integer DEFAULT 0 NOT NULL;