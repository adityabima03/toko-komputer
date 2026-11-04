import { randomBytes } from 'node:crypto';
import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	inArray,
	like,
	lte,
	ne,
	or,
	sql,
	type SQL
} from 'drizzle-orm';
import { calcShippingFee } from '#lib/shipping.js';
import type {
	Address,
	BrandCount,
	Category,
	Order,
	OrderItem,
	OrderWithItems,
	Product,
	ProductFilter,
	ProductSort,
	User
} from '#lib/types.js';
import type { AddressInput } from '#lib/schemas/address.js';
import type { CheckoutItemInput } from '#lib/schemas/checkout.js';
import { db } from './db/index.js';
import { addresses, categories, orderItems, orders, products, users } from './db/schema.js';
import { hashPassword } from './password.js';

export { verifyPassword } from './password.js';

type UserRecord = typeof users.$inferSelect;

export function findUserByEmail(email: string) {
	return db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
}

export function findUserById(id: string) {
	return db.query.users.findFirst({ where: eq(users.id, id) });
}

export async function createUser(data: { name: string; email: string; password: string }) {
	const email = data.email.toLowerCase();
	const existing = await findUserByEmail(email);
	if (existing) return null;

	const id = `u_${randomBytes(8).toString('hex')}`;
	await db.insert(users).values({
		id,
		name: data.name.trim(),
		email,
		role: 'customer',
		passwordHash: hashPassword(data.password)
	});

	return findUserById(id);
}

export async function isEmailTaken(email: string, exceptUserId: string) {
	const row = await db.query.users.findFirst({
		columns: { id: true },
		where: and(eq(users.email, email.toLowerCase()), ne(users.id, exceptUserId))
	});
	return !!row;
}

export async function updateUserProfile(id: string, data: { name: string; email: string }) {
	await db
		.update(users)
		.set({ name: data.name, email: data.email.toLowerCase() })
		.where(eq(users.id, id));
}

export async function updateUserPassword(id: string, passwordHash: string) {
	await db.update(users).set({ passwordHash }).where(eq(users.id, id));
}

export function toPublicUser({ id, name, email, role }: UserRecord): User {
	return { id, name, email, role };
}

export function listCategories(): Promise<Category[]> {
	return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

type ProductRow = typeof products.$inferSelect;

function toProduct({ originalPrice, ...rest }: ProductRow): Product {
	return {
		...rest,
		...(originalPrice != null ? { originalPrice } : {})
	};
}

const productOrder: Record<ProductSort, SQL[]> = {
	popular: [desc(products.sold)],
	rating: [desc(products.rating), desc(products.sold)],
	price_asc: [asc(products.price)],
	price_desc: [desc(products.price)]
};

export async function listProducts(filter: Partial<ProductFilter> = {}) {
	const conditions: SQL[] = [];

	if (filter.category && filter.category !== 'all') {
		conditions.push(eq(products.category, filter.category));
	}

	if (filter.q) {
		const pattern = `%${filter.q}%`;
		conditions.push(or(like(products.name, pattern), like(products.brand, pattern))!);
	}

	if (filter.brands?.length) conditions.push(inArray(products.brand, filter.brands));
	if (filter.minPrice != null) conditions.push(gte(products.price, filter.minPrice));
	if (filter.maxPrice != null) conditions.push(lte(products.price, filter.maxPrice));
	if (filter.inStock) conditions.push(gt(products.stock, 0));

	const rows = await db
		.select()
		.from(products)
		.where(and(...conditions))
		.orderBy(...productOrder[filter.sort ?? 'popular']);

	return rows.map(toProduct);
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
	const row = await db.query.products.findFirst({ where: eq(products.slug, slug) });
	return row ? toProduct(row) : null;
}

export function slugifyProductName(input: string) {
	return input
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 180);
}

function parseSpecs(specs: string) {
	return specs
		.split(/\n|,/)
		.map((item) => item.trim())
		.filter(Boolean)
		.slice(0, 12);
}

export async function createProduct(input: {
	name: string;
	slug?: string;
	category: string;
	brand: string;
	price: number;
	originalPrice?: number;
	stock: number;
	specs: string;
	image: string;
}) {
	const category = await db.query.categories.findFirst({
		where: eq(categories.slug, input.category)
	});
	if (!category) return { error: 'category' as const };

	const slug = input.slug?.trim() || slugifyProductName(input.name);
	if (!slug) return { error: 'slug' as const };

	const existing = await findProductBySlug(slug);
	if (existing) return { error: 'slug_taken' as const };

	const id = `p_${randomBytes(8).toString('hex')}`;
	await db.insert(products).values({
		id,
		name: input.name.trim(),
		slug,
		category: input.category,
		brand: input.brand.trim(),
		price: input.price,
		originalPrice: input.originalPrice,
		stock: input.stock,
		specs: parseSpecs(input.specs),
		image: input.image.trim(),
		rating: 0,
		sold: 0
	});

	const product = await findProductBySlug(slug);
	return product ? { product } : { error: 'failed' as const };
}

/** Daftar brand beserta jumlah produknya, opsional dibatasi ke satu kategori. */
export function listBrands(category?: string | null): Promise<BrandCount[]> {
	return db
		.select({ name: products.brand, count: count() })
		.from(products)
		.where(category && category !== 'all' ? eq(products.category, category) : undefined)
		.groupBy(products.brand)
		.orderBy(asc(products.brand));
}

export async function getAdminStats() {
	const [[productCount], [categoryCount], [userCount], [outOfStock], [lowStock]] =
		await Promise.all([
			db.select({ value: count() }).from(products),
			db.select({ value: count() }).from(categories),
			db.select({ value: count() }).from(users),
			db.select({ value: count() }).from(products).where(eq(products.stock, 0)),
			db
				.select({ value: count() })
				.from(products)
				.where(and(gt(products.stock, 0), lte(products.stock, 5)))
		]);

	return {
		products: productCount?.value ?? 0,
		categories: categoryCount?.value ?? 0,
		users: userCount?.value ?? 0,
		outOfStock: outOfStock?.value ?? 0,
		lowStock: lowStock?.value ?? 0
	};
}

export async function listAdminProducts() {
	const rows = await db
		.select({
			id: products.id,
			name: products.name,
			slug: products.slug,
			brand: products.brand,
			category: products.category,
			categoryName: categories.name,
			price: products.price,
			stock: products.stock,
			sold: products.sold,
			rating: products.rating
		})
		.from(products)
		.leftJoin(categories, eq(products.category, categories.slug))
		.orderBy(asc(products.name));

	return rows;
}

type AddressRow = typeof addresses.$inferSelect;

function toAddress(row: AddressRow): Address {
	return row;
}

export async function listAddresses(userId: string): Promise<Address[]> {
	const rows = await db
		.select()
		.from(addresses)
		.where(eq(addresses.userId, userId))
		.orderBy(desc(addresses.isDefault), asc(addresses.createdAt));
	return rows.map(toAddress);
}

export async function findAddressById(id: string, userId: string): Promise<Address | null> {
	const row = await db.query.addresses.findFirst({
		where: and(eq(addresses.id, id), eq(addresses.userId, userId))
	});
	return row ? toAddress(row) : null;
}

async function clearDefaultAddresses(userId: string, exceptId?: string) {
	const conditions = [eq(addresses.userId, userId), eq(addresses.isDefault, true)];
	if (exceptId) conditions.push(ne(addresses.id, exceptId));
	await db
		.update(addresses)
		.set({ isDefault: false })
		.where(and(...conditions));
}

export async function createAddress(userId: string, data: AddressInput) {
	const existing = await listAddresses(userId);
	const id = `a_${randomBytes(8).toString('hex')}`;
	const isDefault = data.isDefault || existing.length === 0;

	if (isDefault) await clearDefaultAddresses(userId);

	await db.insert(addresses).values({
		id,
		userId,
		label: data.label.trim(),
		recipientName: data.recipientName.trim(),
		phone: data.phone.trim(),
		addressLine: data.addressLine.trim(),
		city: data.city.trim(),
		province: data.province.trim(),
		postalCode: data.postalCode.trim(),
		isDefault
	});

	return findAddressById(id, userId);
}

export async function updateAddress(id: string, userId: string, data: AddressInput) {
	const current = await findAddressById(id, userId);
	if (!current) return null;

	if (data.isDefault) await clearDefaultAddresses(userId, id);

	await db
		.update(addresses)
		.set({
			label: data.label.trim(),
			recipientName: data.recipientName.trim(),
			phone: data.phone.trim(),
			addressLine: data.addressLine.trim(),
			city: data.city.trim(),
			province: data.province.trim(),
			postalCode: data.postalCode.trim(),
			isDefault: data.isDefault || current.isDefault
		})
		.where(and(eq(addresses.id, id), eq(addresses.userId, userId)));

	return findAddressById(id, userId);
}

export async function setDefaultAddress(id: string, userId: string) {
	const current = await findAddressById(id, userId);
	if (!current) return false;

	await clearDefaultAddresses(userId);
	await db
		.update(addresses)
		.set({ isDefault: true })
		.where(and(eq(addresses.id, id), eq(addresses.userId, userId)));
	return true;
}

export async function deleteAddress(id: string, userId: string) {
	const current = await findAddressById(id, userId);
	if (!current) return false;

	await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, userId)));

	if (current.isDefault) {
		const remaining = await listAddresses(userId);
		if (remaining[0]) {
			await db
				.update(addresses)
				.set({ isDefault: true })
				.where(eq(addresses.id, remaining[0].id));
		}
	}

	return true;
}

type OrderRow = typeof orders.$inferSelect;
type OrderItemRow = typeof orderItems.$inferSelect;

function toOrder(row: OrderRow): Order {
	return row;
}

function toOrderItem(row: OrderItemRow): OrderItem {
	return row;
}

export async function listOrdersByUser(userId: string): Promise<OrderWithItems[]> {
	const orderRows = await db
		.select()
		.from(orders)
		.where(eq(orders.userId, userId))
		.orderBy(desc(orders.createdAt));

	if (orderRows.length === 0) return [];

	const itemRows = await db
		.select()
		.from(orderItems)
		.where(
			inArray(
				orderItems.orderId,
				orderRows.map((o) => o.id)
			)
		);

	const itemsByOrder = new Map<string, OrderItem[]>();
	for (const item of itemRows) {
		const list = itemsByOrder.get(item.orderId) ?? [];
		list.push(toOrderItem(item));
		itemsByOrder.set(item.orderId, list);
	}

	return orderRows.map((row) => ({
		...toOrder(row),
		items: itemsByOrder.get(row.id) ?? []
	}));
}

export async function findOrderById(id: string, userId: string): Promise<OrderWithItems | null> {
	const row = await db.query.orders.findFirst({
		where: and(eq(orders.id, id), eq(orders.userId, userId))
	});
	if (!row) return null;

	const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
	return { ...toOrder(row), items: items.map(toOrderItem) };
}

export type CreateOrderResult =
	| { order: OrderWithItems }
	| {
			error:
				| 'empty'
				| 'address'
				| 'product_missing'
				| 'stock'
				| 'failed';
			message?: string;
	  };

export async function createOrder(
	userId: string,
	addressId: string,
	rawItems: CheckoutItemInput[]
): Promise<CreateOrderResult> {
	if (rawItems.length === 0) return { error: 'empty' };

	const address = await findAddressById(addressId, userId);
	if (!address) return { error: 'address' };

	const qtyByProduct = new Map<string, number>();
	for (const item of rawItems) {
		qtyByProduct.set(item.productId, (qtyByProduct.get(item.productId) ?? 0) + item.qty);
	}

	const productIds = [...qtyByProduct.keys()];
	const productRows = await db.select().from(products).where(inArray(products.id, productIds));
	const productById = new Map(productRows.map((p) => [p.id, toProduct(p)]));

	for (const productId of productIds) {
		const product = productById.get(productId);
		if (!product) {
			return { error: 'product_missing', message: 'Ada produk yang sudah tidak tersedia' };
		}
		const qty = qtyByProduct.get(productId)!;
		if (product.stock < qty) {
			return {
				error: 'stock',
				message: `Stok ${product.name} tidak mencukupi (tersedia ${product.stock})`
			};
		}
	}

	const lineItems = productIds.map((productId) => {
		const product = productById.get(productId)!;
		const qty = qtyByProduct.get(productId)!;
		return {
			product,
			qty,
			lineTotal: product.price * qty
		};
	});

	const subtotal = lineItems.reduce((n, item) => n + item.lineTotal, 0);
	const shippingFee = calcShippingFee(subtotal);
	const total = subtotal + shippingFee;
	const orderId = `o_${randomBytes(8).toString('hex')}`;

	try {
		await db.transaction(async (tx) => {
			for (const { product, qty } of lineItems) {
				const [header] = await tx
					.update(products)
					.set({
						stock: sql`${products.stock} - ${qty}`,
						sold: sql`${products.sold} + ${qty}`
					})
					.where(and(eq(products.id, product.id), gte(products.stock, qty)));

				if (header.affectedRows === 0) {
					throw new Error(`stock:${product.name}`);
				}
			}

			await tx.insert(orders).values({
				id: orderId,
				userId,
				status: 'menunggu_pembayaran',
				recipientName: address.recipientName,
				phone: address.phone,
				addressLine: address.addressLine,
				city: address.city,
				province: address.province,
				postalCode: address.postalCode,
				subtotal,
				shippingFee,
				total
			});

			await tx.insert(orderItems).values(
				lineItems.map(({ product, qty, lineTotal }) => ({
					id: `oi_${randomBytes(8).toString('hex')}`,
					orderId,
					productId: product.id,
					productName: product.name,
					productSlug: product.slug,
					productImage: product.image,
					brand: product.brand,
					price: product.price,
					qty,
					lineTotal
				}))
			);
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('stock:')) {
			return {
				error: 'stock',
				message: `Stok ${error.message.slice(6)} tidak mencukupi`
			};
		}
		return { error: 'failed' };
	}

	const order = await findOrderById(orderId, userId);
	return order ? { order } : { error: 'failed' };
}
