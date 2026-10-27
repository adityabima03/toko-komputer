import { getAdminStats, listAdminProducts } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, products] = await Promise.all([getAdminStats(), listAdminProducts()]);
	const attention = products
		.filter((product) => product.stock <= 5)
		.sort((a, b) => a.stock - b.stock)
		.slice(0, 8);

	return { stats, attention };
};
