import { parseProductFilter } from '#lib/product-filter.js';
import { listBrands, listCategories, listProducts } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filter = parseProductFilter(url.searchParams);

	const [categories, brands, products] = await Promise.all([
		listCategories(),
		listBrands(filter.category),
		listProducts(filter)
	]);

	return { categories, brands, products, filter };
};
