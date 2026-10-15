export type User = {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'customer';
};

export type Category = {
	slug: string;
	name: string;
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
};

export type ProductFilter = {
	category: string;
	q: string;
};

export type ApiErrorBody = {
	message: string;
};
