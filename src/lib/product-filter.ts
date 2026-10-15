import type { ProductFilter, ProductSort } from '#lib/types.js';

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
	{ value: 'popular', label: 'Terlaris' },
	{ value: 'rating', label: 'Rating tertinggi' },
	{ value: 'price_asc', label: 'Harga terendah' },
	{ value: 'price_desc', label: 'Harga tertinggi' }
];

export const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
	{ label: '< Rp2 jt', max: 2_000_000 },
	{ label: 'Rp2–5 jt', min: 2_000_000, max: 5_000_000 },
	{ label: 'Rp5–10 jt', min: 5_000_000, max: 10_000_000 },
	{ label: 'Rp10–20 jt', min: 10_000_000, max: 20_000_000 },
	{ label: '> Rp20 jt', min: 20_000_000 }
];

export const DEFAULT_PRODUCT_FILTER: ProductFilter = {
	category: 'all',
	q: '',
	brands: [],
	inStock: false,
	sort: 'popular'
};

function toPrice(value: string | null) {
	if (!value) return undefined;
	const n = Number(value);
	return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

/** Dipakai di endpoint API dan di halaman, supaya format URL filter selalu sama. */
export function parseProductFilter(params: Pick<URLSearchParams, 'get' | 'getAll'>): ProductFilter {
	const sort = params.get('sort');
	return {
		category: params.get('category') || 'all',
		q: params.get('q')?.trim() ?? '',
		brands: params.getAll('brand').filter(Boolean),
		minPrice: toPrice(params.get('min')),
		maxPrice: toPrice(params.get('max')),
		inStock: params.get('stock') === '1',
		sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as ProductSort) : 'popular'
	};
}

/** Hanya menulis nilai yang berbeda dari default, supaya URL tetap pendek. */
export function toSearchParams(filter: ProductFilter) {
	const params = new URLSearchParams();
	if (filter.category !== 'all') params.set('category', filter.category);
	if (filter.q) params.set('q', filter.q);
	for (const brand of filter.brands) params.append('brand', brand);
	if (filter.minPrice != null) params.set('min', String(filter.minPrice));
	if (filter.maxPrice != null) params.set('max', String(filter.maxPrice));
	if (filter.inStock) params.set('stock', '1');
	if (filter.sort !== 'popular') params.set('sort', filter.sort);
	return params;
}

export function activeFilterCount(filter: ProductFilter) {
	return (
		(filter.category !== 'all' ? 1 : 0) +
		filter.brands.length +
		(filter.minPrice != null || filter.maxPrice != null ? 1 : 0) +
		(filter.inStock ? 1 : 0)
	);
}
