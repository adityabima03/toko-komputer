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

export type Address = {
	id: string;
	userId: string;
	label: string;
	recipientName: string;
	phone: string;
	addressLine: string;
	city: string;
	province: string;
	postalCode: string;
	isDefault: boolean;
	createdAt: Date;
};

export type OrderStatus =
	| 'menunggu_pembayaran'
	| 'dibayar'
	| 'dikirim'
	| 'selesai'
	| 'dibatalkan';

export type OrderItem = {
	id: string;
	orderId: string;
	productId: string | null;
	productName: string;
	productSlug: string;
	productImage: string;
	brand: string;
	price: number;
	qty: number;
	lineTotal: number;
};

export type Order = {
	id: string;
	userId: string;
	status: OrderStatus;
	recipientName: string;
	phone: string;
	addressLine: string;
	city: string;
	province: string;
	postalCode: string;
	subtotal: number;
	shippingFee: number;
	total: number;
	paymentProof: string | null;
	paidAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

export type OrderWithItems = Order & {
	items: OrderItem[];
};

export type AdminOrderListItem = Order & {
	customerName: string;
	customerEmail: string;
	itemCount: number;
};
