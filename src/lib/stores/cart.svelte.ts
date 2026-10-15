import { PersistedState } from 'runed';
import type { Product } from '#lib/types.js';

export type CartItem = { product: Product; qty: number };

class CartStore {
	#items = new PersistedState<CartItem[]>('tk-cart', []);

	get items() {
		return this.#items.current;
	}

	count = $derived(this.items.reduce((n, i) => n + i.qty, 0));
	total = $derived(this.items.reduce((n, i) => n + i.qty * i.product.price, 0));

	qtyOf = (id: string) => this.items.find((i) => i.product.id === id)?.qty ?? 0;

	/** Mengembalikan `false` kalau jumlah di keranjang sudah mencapai stok. */
	add = (product: Product) => {
		const qty = this.qtyOf(product.id);
		if (qty >= product.stock) return false;

		this.#items.current =
			qty > 0
				? this.items.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i))
				: [...this.items, { product, qty: 1 }];
		return true;
	};

	remove = (id: string) => {
		this.#items.current = this.items.filter((i) => i.product.id !== id);
	};

	clear = () => {
		this.#items.current = [];
	};
}

// Hanya diubah dari browser (klik user), jadi aman sebagai state global meski ada SSR.
export const cart = new CartStore();
