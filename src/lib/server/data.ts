import { and, eq, like, or, type SQL } from 'drizzle-orm';
import type { Category, Product, User } from '#lib/types.js';
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

export function toPublicUser({ id, name, email, role }: UserRecord): User {
	return { id, name, email, role };
}

export function listCategories(): Promise<Category[]> {
	return db.select().from(categories);
}

export async function listProducts(filter: { category?: string | null; q?: string | null } = {}) {
	const conditions: SQL[] = [];

	if (filter.category && filter.category !== 'all') {
		conditions.push(eq(products.category, filter.category));
	}

	if (filter.q) {
		const pattern = `%${filter.q}%`;
		conditions.push(or(like(products.name, pattern), like(products.brand, pattern))!);
	}

	const rows = await db
		.select()
		.from(products)
		.where(and(...conditions));

	return rows.map(({ originalPrice, ...rest }): Product => ({
		...rest,
		...(originalPrice != null ? { originalPrice } : {})
	}));
}
