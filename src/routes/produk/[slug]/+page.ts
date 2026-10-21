import { error } from '@sveltejs/kit';
import axios from 'axios';
import { createApiClient } from '#lib/api/client.js';
import { categoriesQuery, productQuery } from '#lib/api/products.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, url, params }) => {
	const { queryClient } = await parent();
	const client = createApiClient({ fetch, baseURL: new URL('/api', url.origin).href });

	try {
		await Promise.all([
			queryClient.ensureQueryData(productQuery(params.slug, client)),
			queryClient.ensureQueryData(categoriesQuery(client))
		]);
	} catch (e) {
		if (axios.isAxiosError(e) && e.response?.status === 404) {
			error(404, 'Produk tidak ditemukan');
		}
		throw e;
	}

	return { slug: params.slug };
};
