import { queryOptions } from '@tanstack/svelte-query';
import type { Category, Product, ProductFilter } from '#lib/types.js';
import { api, type AxiosInstance } from './client';

export const DEFAULT_PRODUCT_FILTER: ProductFilter = { category: 'all', q: '' };

export const productKeys = {
	all: ['products'] as const,
	list: (filter: ProductFilter) => [...productKeys.all, 'list', filter] as const,
	categories: ['categories'] as const
};

export async function getProducts(filter: ProductFilter, client: AxiosInstance = api) {
	const { data } = await client.get<{ products: Product[] }>('/products', {
		params: { category: filter.category, q: filter.q || undefined }
	});
	return data.products;
}

export async function getCategories(client: AxiosInstance = api) {
	const { data } = await client.get<{ categories: Category[] }>('/categories');
	return data.categories;
}

export const productsQuery = (filter: ProductFilter, client?: AxiosInstance) =>
	queryOptions({
		queryKey: productKeys.list(filter),
		queryFn: () => getProducts(filter, client)
	});

export const categoriesQuery = (client?: AxiosInstance) =>
	queryOptions({
		queryKey: productKeys.categories,
		queryFn: () => getCategories(client),
		staleTime: 1000 * 60 * 30
	});
