import { PersistedState } from 'runed';
import type { Product } from '#lib/types.js';

export type CartItem = { product: Product; qty: number };

const lineTotal = (i: CartItem) => i.qty * i.product.price;

class CartStore {
	#items = new PersistedState<CartItem[]>('tk-cart', []);

	get items() {
		return this.#items.current;
	}

	count = $derived(this.items.reduce((n, i) => n + i.qty, 0));
	/** Item yang masih ada stoknya; hanya ini yang dihitung ke total. */
	available = $derived(this.items.filter((i) => i.product.stock > 0));
	total = $derived(this.available.reduce((n, i) => n + lineTotal(i), 0));
	savings = $derived(
		this.available.reduce(
			(n, i) => n + i.qty * Math.max(0, (i.product.originalPrice ?? 0) - i.product.price),
			0
		)
	);

	qtyOf = (id: string) => this.items.find((i) => i.product.id === id)?.qty ?? 0;

	/** Mengembalikan `false` kalau `qty` melebihi stok. `qty <= 0` menghapus item. */
	setQty = (product: Product, qty: number) => {
		if (qty <= 0) {
			this.remove(product.id);
			return true;
		}
		if (qty > product.stock) return false;

		this.#items.current =
			this.qtyOf(product.id) > 0
				? this.items.map((i) => (i.product.id === product.id ? { ...i, qty } : i))
				: [...this.items, { product, qty }];
		return true;
	};

	add = (product: Product) => this.setQty(product, this.qtyOf(product.id) + 1);

	remove = (id: string) => {
		this.#items.current = this.items.filter((i) => i.product.id !== id);
	};

	clear = () => {
		this.#items.current = [];
	};

	restore = (items: CartItem[]) => {
		this.#items.current = items;
	};

	/**
	 * Menyamakan harga/stok dengan data terbaru dari server. Produk yang sudah tidak ada dihapus,
	 * jumlah dipotong ke stok. Mengembalikan `true` kalau ada yang berubah.
	 */
	sync = (latest: Product[]) => {
		const byId = new Map(latest.map((p) => [p.id, p]));
		const next = this.items.flatMap((i) => {
			const product = byId.get(i.product.id);
			if (!product) return [];
			const qty = product.stock > 0 ? Math.min(i.qty, product.stock) : i.qty;
			return [{ product, qty }];
		});

		if (JSON.stringify(next) === JSON.stringify(this.items)) return false;
		this.#items.current = next;
		return true;
	};
}

// Hanya diubah dari browser (klik user), jadi aman sebagai state global meski ada SSR.
export const cart = new CartStore();
