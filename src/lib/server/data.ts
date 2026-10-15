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
	type SQL
} from 'drizzle-orm';
import type {
	BrandCount,
	Category,
	Product,
	ProductFilter,
	ProductSort,
	User
} from '#lib/types.js';
import { db } from './db/index.js';
import { categories, products, users } from './db/schema.js';

export { verifyPassword } from './password.js';

type UserRecord = typeof users.$inferSelect;

export function findUserByEmail(email: string) {
	return db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
}

export function findUserById(id: string) {
	return db.query.users.findFirst({ where: eq(users.id, id) });
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
	return db.select().from(categories);
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

	return rows.map(({ originalPrice, ...rest }): Product => ({
		...rest,
		...(originalPrice != null ? { originalPrice } : {})
	}));
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
