import {
	boolean,
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

export const addresses = mysqlTable('addresses', {
	id: varchar('id', { length: 64 }).primaryKey(),
	userId: varchar('user_id', { length: 64 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	label: varchar('label', { length: 40 }).notNull(),
	recipientName: varchar('recipient_name', { length: 120 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	addressLine: varchar('address_line', { length: 255 }).notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	province: varchar('province', { length: 100 }).notNull(),
	postalCode: varchar('postal_code', { length: 10 }).notNull(),
	isDefault: boolean('is_default').notNull().default(false),
	createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
});

export const orderStatusEnum = [
	'menunggu_pembayaran',
	'dibayar',
	'dikirim',
	'selesai',
	'dibatalkan'
] as const;

export const orders = mysqlTable('orders', {
	id: varchar('id', { length: 64 }).primaryKey(),
	userId: varchar('user_id', { length: 64 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	status: mysqlEnum('status', orderStatusEnum).notNull().default('menunggu_pembayaran'),
	recipientName: varchar('recipient_name', { length: 120 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	addressLine: varchar('address_line', { length: 255 }).notNull(),
	city: varchar('city', { length: 100 }).notNull(),
	province: varchar('province', { length: 100 }).notNull(),
	postalCode: varchar('postal_code', { length: 10 }).notNull(),
	subtotal: int('subtotal').notNull(),
	shippingFee: int('shipping_fee').notNull(),
	total: int('total').notNull(),
	paymentProof: varchar('payment_proof', { length: 500 }),
	paidAt: timestamp('paid_at', { mode: 'date', fsp: 3 }),
	createdAt: timestamp('created_at', { mode: 'date', fsp: 3 }).notNull().defaultNow(),
	// MySQL + fsp:3 menolak ON UPDATE CURRENT_TIMESTAMP; diperbarui manual saat status berubah.
	updatedAt: timestamp('updated_at', { mode: 'date', fsp: 3 }).notNull().defaultNow()
});

export const orderItems = mysqlTable('order_items', {
	id: varchar('id', { length: 64 }).primaryKey(),
	orderId: varchar('order_id', { length: 64 })
		.notNull()
		.references(() => orders.id, { onDelete: 'cascade' }),
	productId: varchar('product_id', { length: 64 }).references(() => products.id, {
		onDelete: 'set null'
	}),
	productName: varchar('product_name', { length: 190 }).notNull(),
	productSlug: varchar('product_slug', { length: 190 }).notNull(),
	productImage: varchar('product_image', { length: 500 }).notNull(),
	brand: varchar('brand', { length: 120 }).notNull(),
	price: int('price').notNull(),
	qty: int('qty').notNull(),
	lineTotal: int('line_total').notNull()
});
