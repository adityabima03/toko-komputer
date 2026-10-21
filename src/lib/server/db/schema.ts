import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	// Selalu disimpan dalam huruf kecil agar pencarian email tidak case-sensitive.
	email: text('email').notNull().unique(),
	role: text('role', { enum: ['admin', 'customer'] })
		.notNull()
		.default('customer'),
	passwordHash: text('password_hash').notNull()
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull()
});

export const categories = sqliteTable('categories', {
	slug: text('slug').primaryKey(),
	name: text('name').notNull()
});

export const products = sqliteTable('products', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	category: text('category')
		.notNull()
		.references(() => categories.slug),
	brand: text('brand').notNull(),
	price: integer('price').notNull(),
	originalPrice: integer('original_price'),
	rating: real('rating').notNull().default(0),
	sold: integer('sold').notNull().default(0),
	stock: integer('stock').notNull().default(0),
	specs: text('specs', { mode: 'json' }).$type<string[]>().notNull().default([]),
	image: text('image').notNull()
});
