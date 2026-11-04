import { error } from '@sveltejs/kit';
import { findProductBySlug, listCategories } from '#lib/server/data.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [product, categories] = await Promise.all([
		findProductBySlug(params.slug),
		listCategories()
	]);

	if (!product) error(404, 'Produk tidak ditemukan');

	return { product, categories };
};
