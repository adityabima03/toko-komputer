import { error, json } from '@sveltejs/kit';
import { rejectBrowserNavigation } from '#lib/server/api-guard.js';
import { findProductBySlug } from '#lib/server/data.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params }) => {
	rejectBrowserNavigation(request);
	const product = await findProductBySlug(params.slug);
	if (!product) error(404, 'Produk tidak ditemukan');
	return json({ product });
};
