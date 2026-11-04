import { DEFAULT_PRODUCT_FILTER } from '#lib/product-filter.js';
import { listCategories, listProducts } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filter = {
		...DEFAULT_PRODUCT_FILTER,
		category: url.searchParams.get('category') || 'all',
		q: url.searchParams.get('q')?.trim() ?? ''
	};

	const [categories, products] = await Promise.all([
		listCategories(),
		listProducts(filter)
	]);

	return { categories, products, filter };
};
