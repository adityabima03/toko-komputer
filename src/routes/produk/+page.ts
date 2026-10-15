import { browser } from '$app/env';
import { createApiClient } from '#lib/api/client.js';
import { brandsQuery, categoriesQuery, productsQuery } from '#lib/api/products.js';
import { parseProductFilter } from '#lib/product-filter.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, url }) => {
	// Di browser, perubahan filter langsung ditangani TanStack Query tanpa menunggu load.
	if (browser) return;

	const { queryClient } = await parent();
	const client = createApiClient({ fetch, baseURL: new URL('/api', url.origin).href });
	const filter = parseProductFilter(url.searchParams);

	await Promise.all([
		queryClient.prefetchQuery(categoriesQuery(client)),
		queryClient.prefetchQuery(brandsQuery(filter.category, client)),
		queryClient.prefetchQuery(productsQuery(filter, client))
	]);
};
