import { json } from '@sveltejs/kit';
import { parseProductFilter } from '#lib/product-filter.js';
import { listProducts } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const products = await listProducts(parseProductFilter(url.searchParams));
	return json({ products });
};
