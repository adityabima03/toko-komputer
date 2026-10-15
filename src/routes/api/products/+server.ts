import { json } from '@sveltejs/kit';
import { products } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const category = url.searchParams.get('category');
	const q = url.searchParams.get('q')?.trim().toLowerCase();

	let result = products;

	if (category && category !== 'all') {
		result = result.filter((p) => p.category === category);
	}

	if (q) {
		result = result.filter(
			(p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
		);
	}

	return json({ products: result });
};
