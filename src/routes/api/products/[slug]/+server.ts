import { error, json } from '@sveltejs/kit';
import { findProductBySlug } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const product = await findProductBySlug(params.slug);
	if (!product) error(404, 'Produk tidak ditemukan');
	return json({ product });
};
