import { json } from '@sveltejs/kit';
import { listProducts } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const products = await listProducts({
		category: url.searchParams.get('category'),
		q: url.searchParams.get('q')?.trim()
	});

	return json({ products });
};
