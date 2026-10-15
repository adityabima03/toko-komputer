import { queryOptions } from '@tanstack/svelte-query';
import { toSearchParams } from '#lib/product-filter.js';
import type { BrandCount, Category, Product, ProductFilter } from '#lib/types.js';
import { api, type AxiosInstance } from './client';

export { DEFAULT_PRODUCT_FILTER } from '#lib/product-filter.js';

export const productKeys = {
	all: ['products'] as const,
	list: (filter: ProductFilter) => [...productKeys.all, 'list', filter] as const,
	categories: ['categories'] as const,
	brands: (category: string) => ['brands', category] as const
};

export async function getProducts(filter: ProductFilter, client: AxiosInstance = api) {
	const { data } = await client.get<{ products: Product[] }>('/products', {
		params: toSearchParams(filter)
	});
	return data.products;
}

export async function getCategories(client: AxiosInstance = api) {
	const { data } = await client.get<{ categories: Category[] }>('/categories');
	return data.categories;
}

export async function getBrands(category: string, client: AxiosInstance = api) {
	const { data } = await client.get<{ brands: BrandCount[] }>('/brands', {
		params: category !== 'all' ? { category } : undefined
	});
	return data.brands;
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

export const brandsQuery = (category: string, client?: AxiosInstance) =>
	queryOptions({
		queryKey: productKeys.brands(category),
		queryFn: () => getBrands(category, client),
		staleTime: 1000 * 60 * 30
	});
