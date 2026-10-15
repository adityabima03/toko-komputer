import { createApiClient } from '#lib/api/client.js';
import { DEFAULT_PRODUCT_FILTER, categoriesQuery, productsQuery } from '#lib/api/products.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, fetch, url }) => {
	const { queryClient } = await parent();
	const client = createApiClient({ fetch, baseURL: new URL('/api', url.origin).href });

	await Promise.all([
		queryClient.prefetchQuery(categoriesQuery(client)),
		queryClient.prefetchQuery(productsQuery(DEFAULT_PRODUCT_FILTER, client))
	]);
};
