import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { toast } from 'svelte-sonner';
import { cart } from '#lib/stores/cart.svelte.js';
import type { Product } from '#lib/types.js';

export function addToCart(product: Product) {
	if (!cart.add(product)) {
		toast.error('Stok tidak mencukupi', {
			description: `Maksimal ${product.stock} unit untuk ${product.name}`
		});
		return;
	}
	toast.success('Ditambahkan ke keranjang', {
		description: product.name,
		action: { label: 'Lihat', onClick: () => goto(resolve('/keranjang')) }
	});
}
