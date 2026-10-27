import {
	double,
	int,
	json,
	mysqlEnum,
	mysqlTable,
	timestamp,
	varchar
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
	id: varchar('id', { length: 64 }).primaryKey(),
	name: varchar('name', { length: 120 }).notNull(),
	// Selalu disimpan dalam huruf kecil agar pencarian email tidak case-sensitive.
	email: varchar('email', { length: 190 }).notNull().unique(),
	role: mysqlEnum('role', ['admin', 'customer']).notNull().default('customer'),
	passwordHash: varchar('password_hash', { length: 255 }).notNull()
});

export const sessions = mysqlTable('sessions', {
	id: varchar('id', { length: 64 }).primaryKey(),
	userId: varchar('user_id', { length: 64 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { mode: 'date', fsp: 3 }).notNull()
});

export const categories = mysqlTable('categories', {
	slug: varchar('slug', { length: 64 }).primaryKey(),
	name: varchar('name', { length: 120 }).notNull(),
	groupName: varchar('group_name', { length: 64 }).notNull(),
	sortOrder: int('sort_order').notNull()
});

export const products = mysqlTable('products', {
	id: varchar('id', { length: 64 }).primaryKey(),
	name: varchar('name', { length: 190 }).notNull(),
	slug: varchar('slug', { length: 190 }).notNull().unique(),
	category: varchar('category', { length: 64 })
		.notNull()
		.references(() => categories.slug),
	brand: varchar('brand', { length: 120 }).notNull(),
	price: int('price').notNull(),
	originalPrice: int('original_price'),
	rating: double('rating').notNull().default(0),
	sold: int('sold').notNull().default(0),
	stock: int('stock').notNull().default(0),
	specs: json('specs').$type<string[]>().notNull().default([]),
	image: varchar('image', { length: 500 }).notNull()
});
