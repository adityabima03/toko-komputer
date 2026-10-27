export type User = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'customer';
};

export type Category = {
	slug: string;
	name: string;
	groupName: string;
	sortOrder: number;
};

export type Product = {
	id: string;
	name: string;
	slug: string;
	category: string;
	brand: string;
	price: number;
	originalPrice?: number;
	rating: number;
	sold: number;
	stock: number;
	specs: string[];
	image: string;
};

export type ProductSort = 'popular' | 'price_asc' | 'price_desc' | 'rating';

export type ProductFilter = {
	category: string;
	q: string;
	brands: string[];
	minPrice?: number;
	maxPrice?: number;
	inStock: boolean;
	sort: ProductSort;
};

export type BrandCount = {
	name: string;
	count: number;
};

export type ApiErrorBody = {
	message: string;
};
